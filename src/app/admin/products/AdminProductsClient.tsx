'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Product, getStockStatus } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AdminProductsClientProps {
  initialProducts: Product[];
}

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
type SortKey = 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'name_asc';

interface ProductFormData {
  id?: string;
  name: string;
  sku: string;
  price: string;
  category: string;
  description: string;
  stock: string;
  low_stock_threshold: string;
  featured: boolean;
  visible: boolean;
  image_url: string;
  scent: string;
  inspired_by: string;
  weight_oz: string;
}

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  // Sync changes via local storage to preserve demo actions
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kgiants_products');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialProducts;
        }
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kgiants_products', JSON.stringify(products));
    }
  }, [products]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name_asc');

  // Audit state (Taking Inventory bulk edits)
  const [isAuditMode, setIsAuditMode] = useState(false);
  const [auditStocks, setAuditStocks] = useState<Record<string, number>>({});

  // Modal State (Add/Edit product drawer)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: '',
    category: '',
    description: '',
    stock: '0',
    low_stock_threshold: '2',
    featured: false,
    visible: true,
    image_url: '',
    scent: '',
    inspired_by: '',
    weight_oz: '2'
  });

  // Categories list
  const categories = useMemo(() => {
    const list = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [products]);

  // Initialize form data when editing or opening to add
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      price: '',
      category: categories[0] || 'Waterless Diffuser',
      description: '',
      stock: '0',
      low_stock_threshold: '2',
      featured: false,
      visible: true,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      scent: '',
      inspired_by: '',
      weight_oz: '2'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      stock: product.stock.toString(),
      low_stock_threshold: product.low_stock_threshold.toString(),
      featured: product.featured || false,
      visible: product.visible || false,
      image_url: product.image_url || '',
      scent: product.scent || '',
      inspired_by: product.inspired_by || '',
      weight_oz: (product.weight_oz || 2).toString()
    });
    setIsModalOpen(true);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory =
          categoryFilter === 'all' ? true : p.category.toLowerCase() === categoryFilter.toLowerCase();
        
        const status = getStockStatus(p);
        const matchesStock =
          stockFilter === 'all' ? true : status === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortKey === 'price_asc') return a.price - b.price;
        if (sortKey === 'price_desc') return b.price - a.price;
        if (sortKey === 'stock_asc') return a.stock - b.stock;
        if (sortKey === 'stock_desc') return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, categoryFilter, stockFilter, sortKey]);

  // Patch a single product field quickly (increment/decrement stock, toggle visibility)
  const patchQuick = async (id: string, body: Record<string, unknown>) => {
    // Optimistic state update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...body } : p));
    toast.success('Inventory updated');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      });
      // Database update failed, but optimistic local storage change holds
      if (!res.ok) console.warn('Supabase offline fallback - changes persistent locally');
    } catch {
      console.warn('Network issue - changes persistent locally');
    }
  };

  // Submit product creation or full details edit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);
    const thresholdNum = parseInt(formData.low_stock_threshold);
    const weightNum = parseFloat(formData.weight_oz);

    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid price');
      setSaving(false);
      return;
    }

    const payload = {
      name: formData.name,
      sku: formData.sku || 'SKU-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      price: priceNum,
      category: formData.category,
      description: formData.description,
      stock: isNaN(stockNum) ? 0 : stockNum,
      low_stock_threshold: isNaN(thresholdNum) ? 2 : thresholdNum,
      featured: formData.featured,
      visible: formData.visible,
      image_url: formData.image_url,
      images: [formData.image_url || ''],
      scent: formData.scent || undefined,
      inspired_by: formData.inspired_by || undefined,
      weight_oz: isNaN(weightNum) ? 2 : weightNum
    };

    if (editingProduct) {
      // EDIT OPERATION
      const pId = editingProduct.id;
      setProducts(prev => prev.map(p => p.id === pId ? { ...p, ...payload } : p));
      toast.success('Product updated successfully');
      setIsModalOpen(false);

      try {
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: pId, ...payload }),
        });
        if (!res.ok) console.warn('Supabase offline fallback');
      } catch {
        console.warn('Network error fallback');
      }
    } else {
      // ADD OPERATION
      const tempId = 'prod-' + Math.random().toString(36).substring(2, 9);
      const newProduct: Product = {
        id: tempId,
        ...payload
      };

      setProducts(prev => [newProduct, ...prev]);
      toast.success('New product added to inventory');
      setIsModalOpen(false);

      try {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          // Replace temp random ID with real database ID returned
          setProducts(prev => prev.map(p => p.id === tempId ? data.product : p));
        }
      } catch {
        console.warn('Network error fallback');
      }
    }
    setSaving(false);
  };

  // Delete product (or hide it)
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product removed');
      // If modal was editing it, close it
      if (editingProduct?.id === id) setIsModalOpen(false);
    }
  };

  // Bulk audit "Taking Inventory" triggers
  const startAuditMode = () => {
    const stocks: Record<string, number> = {};
    products.forEach(p => {
      stocks[p.id] = p.stock;
    });
    setAuditStocks(stocks);
    setIsAuditMode(true);
    toast.success('Audit mode enabled: edit stocks directly below');
  };

  const commitAudit = async () => {
    // Update state
    setProducts(prev =>
      prev.map(p => {
        if (auditStocks[p.id] !== undefined) {
          return { ...p, stock: auditStocks[p.id] };
        }
        return p;
      })
    );
    setIsAuditMode(false);
    toast.success('Stocktaking audit committed successfully!');

    // Push each update asynchronously in the background
    for (const [id, stock] of Object.entries(auditStocks)) {
      try {
        await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, stock }),
        });
      } catch {
        // quiet fail
      }
    }
  };

  // CSV Export Utility
  const exportToCSV = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'Price', 'Stock', 'Threshold', 'Scent', 'Inspired By', 'Featured', 'Visible'];
    const rows = products.map(p => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.price,
      p.stock,
      p.low_stock_threshold,
      p.scent || '',
      p.inspired_by || '',
      p.featured ? 'YES' : 'NO',
      p.visible ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kgiants_inventory_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Report Downloaded');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={panelHeader}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Take Inventory
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-stone)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
            {products.length} products logged. Manage stock counts, replenish items, and control visibility.
          </p>
        </div>
        <div style={actionButtonGroup}>
          <button onClick={exportToCSV} style={subtleBtn}>Export CSV Spreadsheet</button>
          
          {isAuditMode ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setIsAuditMode(false)} style={subtleBtn}>Cancel</button>
              <button onClick={commitAudit} style={primaryBtn}>Commit Bulk Audit</button>
            </div>
          ) : (
            <button onClick={startAuditMode} style={goldBtn}>Take Bulk Inventory</button>
          )}

          <button onClick={openAddModal} style={emeraldBtn}>Add New Product</button>
        </div>
      </div>

      {/* Catalog Search & Filtering block */}
      <div style={filterPanel}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%' }}>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search products by SKU or title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={searchInput}
          />

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={filterSelect}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            style={filterSelect}
          >
            <option value="name_asc">Name: A to Z</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_asc">Stock: Low to High</option>
            <option value="stock_desc">Stock: High to Low</option>
          </select>

          {/* Stock filter tabs */}
          <div style={filterTabs}>
            {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as StockFilter[]).map(tab => (
              <button
                key={tab}
                style={{
                  ...filterTab,
                  background: stockFilter === tab ? 'var(--color-ink)' : 'transparent',
                  color: stockFilter === tab ? 'var(--color-cream)' : 'var(--color-stone)'
                }}
                onClick={() => setStockFilter(tab)}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Audit Mode Notification Indicator */}
      {isAuditMode && (
        <div style={auditIndicatorBanner}>
          <span>💡 <strong>Bulk Stocktaking Active:</strong> You can edit the exact stock count for any product line directly in the input fields below. Press "Commit Bulk Audit" when completed.</span>
        </div>
      )}

      {/* Inventory Catalog Table */}
      <div style={catalogTableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table style={tbl}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--color-border)' }}>
                {['Item & Category', 'SKU ID', 'Aroma Scent', 'Retail Price', 'Stock Level', 'Stock Health Status', 'Visibility Status', ''].map(col => (
                  <th key={col} style={th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const status = getStockStatus(product);
                const isLow = status === 'low_stock';
                const isOos = status === 'out_of_stock';
                
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle', transition: 'background-color 0.15s' }}>
                    
                    {/* Item and image */}
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{
                            width: 44,
                            height: 44,
                            objectFit: 'contain',
                            padding: 4,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-cream)'
                          }}
                        />
                        <div>
                          <div style={productNameText}>{product.name}</div>
                          <div style={productCatText}>{product.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* SKU ID */}
                    <td style={{ ...td, fontFamily: 'monospace', fontSize: 11, fontWeight: 500, color: 'var(--color-stone)' }}>
                      {product.sku}
                    </td>

                    {/* Scent */}
                    <td style={{ ...td, color: 'var(--color-stone)' }}>
                      {product.scent || '—'}
                      {product.inspired_by && (
                        <div style={{ fontSize: 9, opacity: 0.6 }}>Inspired by {product.inspired_by}</div>
                      )}
                    </td>

                    {/* Retail Price */}
                    <td style={{ ...td, fontWeight: 500 }}>
                      ${product.price.toFixed(2)}
                    </td>

                    {/* Stock level (Editable or quick increments) */}
                    <td style={td}>
                      {isAuditMode ? (
                        <input
                          type="number"
                          min="0"
                          value={auditStocks[product.id] ?? 0}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            setAuditStocks(prev => ({
                              ...prev,
                              [product.id]: isNaN(val) ? 0 : Math.max(0, val)
                            }));
                          }}
                          style={auditInput}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            style={qtyBtn}
                            onClick={() => patchQuick(product.id, { stock: Math.max(0, product.stock - 1) })}
                          >
                            −
                          </button>
                          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 500, fontSize: 14 }}>
                            {product.stock}
                          </span>
                          <button
                            style={qtyBtn}
                            onClick={() => patchQuick(product.id, { stock: product.stock + 1 })}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Stock Health status badge */}
                    <td style={td}>
                      <span style={badgeStyle(status)}>
                        {status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Toggle visibility */}
                    <td style={td}>
                      <button
                        style={{
                          ...visibleBtn,
                          border: `1.5px solid ${product.visible ? 'var(--color-emerald)' : 'var(--color-border)'}`,
                          background: product.visible ? 'var(--color-emerald-light)' : 'transparent',
                          color: product.visible ? 'var(--color-emerald)' : 'var(--color-stone)'
                        }}
                        onClick={() => patchQuick(product.id, { visible: !product.visible })}
                      >
                        {product.visible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>

                    {/* Operations */}
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditModal(product)} style={textActionBtn}>Edit specifications</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ ...td, textAlign: 'center', padding: 64, color: 'var(--color-stone-light)' }}>
                    No products matching filter queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer Product Edit / Add Modal */}
      {isModalOpen && (
        <div style={modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div style={modalContainer} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--color-ink)' }}>
                {editingProduct ? 'Edit Product Specifications' : 'Log New Catalog Product'}
              </h2>
              <button style={closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={modalForm}>
              <div style={formGrid}>
                {/* Product Name */}
                <div style={formFieldCol2}>
                  <label style={formLabel}>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fragrance Oil — Tokyo"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* SKU */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>SKU ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AP-1040"
                    value={formData.sku}
                    onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Category */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    style={formSelect}
                  >
                    <option value="Waterless Diffuser">Waterless Diffuser</option>
                    <option value="Fragrance Oil">Fragrance Oil</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Display">Display</option>
                  </select>
                </div>

                {/* Price */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Retail Price ($) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 35.00"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Weight */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Weight (oz)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.0"
                    value={formData.weight_oz}
                    onChange={e => setFormData(prev => ({ ...prev, weight_oz: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Stock */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Stock warning threshold */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.low_stock_threshold}
                    onChange={e => setFormData(prev => ({ ...prev, low_stock_threshold: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Scent Profile */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Aroma Scent Name (Fragrance only)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tokyo"
                    value={formData.scent}
                    onChange={e => setFormData(prev => ({ ...prev, scent: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Inspired by */}
                <div style={formFieldCol1}>
                  <label style={formLabel}>Inspired by (Fragrance only)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ritz Carlton®"
                    value={formData.inspired_by}
                    onChange={e => setFormData(prev => ({ ...prev, inspired_by: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Image URL */}
                <div style={formFieldCol2}>
                  <label style={formLabel}>Image URL</label>
                  <input
                    type="text"
                    placeholder="Provide web URL or Unsplash address..."
                    value={formData.image_url}
                    onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    style={formInput}
                  />
                </div>

                {/* Description */}
                <div style={formFieldCol2}>
                  <label style={formLabel}>Catalog Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide a detailed sales pitch and ingredient description..."
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    style={formTextArea}
                  />
                </div>

                {/* Featured Checkbox */}
                <div style={{ ...formCheckboxContainer, gridColumn: 'span 1' }}>
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={formData.featured}
                    onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    style={checkboxStyle}
                  />
                  <label htmlFor="featured-check" style={checkboxLabel}>Feature on homepage</label>
                </div>

                {/* Visible Checkbox */}
                <div style={{ ...formCheckboxContainer, gridColumn: 'span 1' }}>
                  <input
                    type="checkbox"
                    id="visible-check"
                    checked={formData.visible}
                    onChange={e => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                    style={checkboxStyle}
                  />
                  <label htmlFor="visible-check" style={checkboxLabel}>Visible to customers</label>
                </div>
              </div>

              {/* Form operations */}
              <div style={formActions}>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(editingProduct.id)}
                    style={deleteBtn}
                  >
                    Delete Product
                  </button>
                )}
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={subtleBtn}>Cancel</button>
                  <button type="submit" disabled={saving} style={primaryBtn}>
                    {saving ? 'Saving...' : editingProduct ? 'Save Specifications' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Beautiful Styled CSS Styles ──────────────────────────────────────────────

const panelHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  borderBottom: '1px solid var(--color-border)',
  paddingBottom: 20,
  flexWrap: 'wrap',
  gap: 16
};

const actionButtonGroup: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap'
};

const filterPanel: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: '16px 20px',
  display: 'flex'
};

const searchInput: React.CSSProperties = {
  flex: 1.5,
  minWidth: 200,
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-ink)',
  outline: 'none'
};

const filterSelect: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--color-ink)',
  cursor: 'pointer',
  outline: 'none',
  minWidth: 140
};

const filterTabs: React.CSSProperties = {
  display: 'flex',
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: 3,
  gap: 2
};

const filterTab: React.CSSProperties = {
  border: 'none',
  padding: '4px 12px',
  fontFamily: 'var(--font-body)',
  fontSize: 10,
  fontWeight: 500,
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  transition: 'all 0.15s ease-out'
};

const auditIndicatorBanner: React.CSSProperties = {
  background: 'var(--color-emerald-light)',
  border: '1px solid rgba(22, 51, 0, 0.15)',
  padding: '12px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  color: 'var(--color-emerald)'
};

const catalogTableCard: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: 20
};

const tbl: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 300
};

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 9,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-stone-light)',
  fontWeight: 600,
  background: 'var(--color-cream)'
};

const td: React.CSSProperties = {
  padding: '14px 16px',
  color: 'var(--color-ink)'
};

const productNameText: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-ink)',
  lineHeight: 1.3
};

const productCatText: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--color-stone-light)',
  marginTop: 2
};

const qtyBtn: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-ink)',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 14,
  borderRadius: 0,
  transition: 'all 0.15s'
};

const auditInput: React.CSSProperties = {
  width: 70,
  background: 'var(--color-cream)',
  border: '1.5px solid var(--color-ink)',
  padding: '4px 8px',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-ink)',
  outline: 'none',
  textAlign: 'center'
};

const visibleBtn: React.CSSProperties = {
  padding: '4px 10px',
  fontSize: 9,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: 0,
  transition: 'all 0.15s ease-out'
};

const textActionBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  fontSize: 11,
  color: 'var(--color-stone)',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)'
};

const primaryBtn: React.CSSProperties = {
  background: 'var(--color-ink)',
  border: '1.5px solid var(--color-ink)',
  color: 'var(--color-cream)',
  padding: '8px 18px',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.18s ease-out'
};

const emeraldBtn: React.CSSProperties = {
  ...primaryBtn,
  background: 'var(--color-emerald)',
  border: '1.5px solid var(--color-emerald)'
};

const goldBtn: React.CSSProperties = {
  ...primaryBtn,
  background: 'var(--color-emerald-accent)',
  border: '1.5px solid var(--color-emerald-accent)',
  color: 'var(--color-emerald)'
};

const subtleBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1.5px solid var(--color-border)',
  color: 'var(--color-stone)',
  padding: '8px 18px',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.18s ease-out'
};

// Modals Styles
const modalBackdrop: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(14, 15, 12, 0.45)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 100
};

const modalContainer: React.CSSProperties = {
  width: '100%',
  maxWidth: 580,
  background: 'var(--color-white)',
  height: '100vh',
  boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  padding: '40px 32px',
  overflowY: 'auto'
};

const modalHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--color-border)',
  paddingBottom: 20,
  marginBottom: 28
};

const closeBtn: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  fontSize: 18,
  cursor: 'pointer',
  color: 'var(--color-stone)'
};

const modalForm: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1
};

const formGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 20
};

const formFieldCol1: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6
};

const formFieldCol2: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  gridColumn: 'span 2'
};

const formLabel: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--color-stone-light)',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase'
};

const formInput: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-ink)',
  outline: 'none'
};

const formSelect: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-ink)',
  outline: 'none',
  cursor: 'pointer'
};

const formTextArea: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-ink)',
  outline: 'none',
  resize: 'vertical'
};

const formCheckboxContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginTop: 10
};

const checkboxStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  cursor: 'pointer'
};

const checkboxLabel: React.CSSProperties = {
  fontSize: 12,
  fontFamily: 'var(--font-body)',
  fontWeight: 300,
  color: 'var(--color-stone)',
  cursor: 'pointer'
};

const formActions: React.CSSProperties = {
  marginTop: 40,
  borderTop: '1px solid var(--color-border)',
  paddingTop: 24,
  display: 'flex',
  alignItems: 'center',
  width: '100%'
};

const deleteBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#C23A3A',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase'
};

function badgeStyle(status: 'in_stock' | 'low_stock' | 'out_of_stock'): React.CSSProperties {
  let color = 'var(--color-stone)';
  let bg = 'transparent';
  let border = '1px solid var(--color-border)';

  if (status === 'in_stock') {
    color = 'var(--color-emerald)';
    bg = 'var(--color-emerald-light)';
    border = '1px solid rgba(22, 51, 0, 0.15)';
  } else if (status === 'low_stock') {
    color = 'var(--color-gold)';
    bg = '#FFF9E6';
    border = '1px solid #FFEBB3';
  } else if (status === 'out_of_stock') {
    color = '#C23A3A';
    bg = '#FEECEB';
    border = '1px solid rgba(194, 58, 58, 0.15)';
  }

  return {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: 9,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    color,
    background: bg,
    border
  };
}
