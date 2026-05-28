'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Order, Product } from '@/lib/supabase';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Timeframe = '7D' | '4W' | '6M';

interface OverviewClientProps {
  initialOrders: Order[];
  initialProducts: Product[];
}

export default function AdminOverviewClient({ initialOrders, initialProducts }: OverviewClientProps) {
  // Sync changes via local storage to preserve demo actions
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kgiants_orders');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialOrders;
        }
      }
    }
    return initialOrders;
  });

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
      localStorage.setItem('kgiants_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const [timeframe, setTimeframe] = useState<Timeframe>('7D');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);

  // Core metrics
  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'refunded'), [orders]);
  
  const totalRevenue = useMemo(() => {
    return activeOrders
      .filter(o => o.status === 'paid' || o.status === 'fulfilled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [activeOrders]);

  const totalOrdersCount = orders.length;
  const lowStock = useMemo(() => products.filter(p => p.stock > 0 && p.stock <= p.low_stock_threshold), [products]);
  const oos = useMemo(() => products.filter(p => p.stock === 0), [products]);
  const averageOrderValue = useMemo(() => {
    const paidCount = orders.filter(o => o.status === 'paid' || o.status === 'fulfilled').length;
    return paidCount > 0 ? totalRevenue / paidCount : 0;
  }, [orders, totalRevenue]);

  // Aggregate sales chart data
  const chartData = useMemo(() => {
    const now = new Date();
    const data: { key: string; label: string; revenue: number; ordersCount: number }[] = [];

    if (timeframe === '7D') {
      // Last 7 days in order
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
        const key = d.toDateString();
        data.push({ key, label, revenue: 0, ordersCount: 0 });
      }

      orders.forEach(o => {
        if (o.status === 'refunded') return;
        const oDate = new Date(o.created_at);
        const item = data.find(d => d.key === oDate.toDateString());
        if (item) {
          item.revenue += o.total;
          item.ordersCount += 1;
        }
      });
    } else if (timeframe === '4W') {
      // Last 4 weeks (weekly buckets)
      for (let i = 3; i >= 0; i--) {
        const label = `Week ${4 - i}`;
        const key = `wk-${i}`;
        data.push({ key, label, revenue: 0, ordersCount: 0 });
      }

      orders.forEach(o => {
        if (o.status === 'refunded') return;
        const oDate = new Date(o.created_at);
        const diffTime = Math.abs(now.getTime() - oDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weekIdx = Math.floor(diffDays / 7);
        if (weekIdx >= 0 && weekIdx < 4) {
          const item = data[3 - weekIdx]; // oldest first
          if (item) {
            item.revenue += o.total;
            item.ordersCount += 1;
          }
        }
      });
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const label = d.toLocaleDateString(undefined, { month: 'short' });
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        data.push({ key, label, revenue: 0, ordersCount: 0 });
      }

      orders.forEach(o => {
        if (o.status === 'refunded') return;
        const oDate = new Date(o.created_at);
        const key = `${oDate.getFullYear()}-${oDate.getMonth()}`;
        const item = data.find(d => d.key === key);
        if (item) {
          item.revenue += o.total;
          item.ordersCount += 1;
        }
      });
    }
    return data;
  }, [orders, timeframe]);

  // SVG Chart Dimensions
  const chartHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = 640;

  const points = useMemo(() => {
    const revenues = chartData.map(d => d.revenue);
    const maxVal = Math.max(...revenues, 100) * 1.1; // 10% breathing room
    const w = chartWidth - paddingLeft - paddingRight;
    const h = chartHeight - paddingTop - paddingBottom;
    const len = chartData.length;

    return chartData.map((d, index) => {
      const x = paddingLeft + (index / (len - 1)) * w;
      const y = chartHeight - paddingBottom - (d.revenue / maxVal) * h;
      return { x, y, ...d };
    });
  }, [chartData]);

  // Grid Lines for Y Axis
  const gridLines = useMemo(() => {
    const revenues = chartData.map(d => d.revenue);
    const maxVal = Math.max(...revenues, 100) * 1.1;
    const ticks = 4;
    const h = chartHeight - paddingTop - paddingBottom;
    const lines = [];

    for (let i = 0; i <= ticks; i++) {
      const val = (maxVal / ticks) * i;
      const y = chartHeight - paddingBottom - (val / maxVal) * h;
      lines.push({ y, label: `$${Math.round(val)}` });
    }
    return lines;
  }, [chartData]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return 'M ' + points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = chartHeight - paddingBottom;
    return `${linePath} L ${points[points.length - 1].x.toFixed(1)},${bottomY} L ${points[0].x.toFixed(1)},${bottomY} Z`;
  }, [points, linePath]);

  // Popular product categories breakdown
  const categoryStats = useMemo(() => {
    const map: Record<string, { revenue: number; itemsCount: number }> = {};
    activeOrders.forEach(o => {
      if (o.status !== 'paid' && o.status !== 'fulfilled') return;
      o.items?.forEach(item => {
        // Find product category
        const prod = products.find(p => p.id === item.product_id || p.name === item.product_name);
        const cat = prod?.category || 'Fragrance Oil';
        if (!map[cat]) map[cat] = { revenue: 0, itemsCount: 0 };
        map[cat].revenue += item.unit_price * item.quantity;
        map[cat].itemsCount += item.quantity;
      });
    });

    const list = Object.entries(map).map(([name, stat]) => ({
      name,
      revenue: stat.revenue,
      percentage: totalRevenue > 0 ? (stat.revenue / totalRevenue) * 100 : 0
    }));

    return list.sort((a, b) => b.revenue - a.revenue);
  }, [activeOrders, products, totalRevenue]);

  // Scent breakdowns
  const scentStats = useMemo(() => {
    const map: Record<string, number> = {};
    activeOrders.forEach(o => {
      if (o.status !== 'paid' && o.status !== 'fulfilled') return;
      o.items?.forEach(item => {
        const prod = products.find(p => p.id === item.product_id || p.name === item.product_name);
        const scent = prod?.scent || 'N/A';
        if (scent !== 'N/A') {
          map[scent] = (map[scent] || 0) + item.quantity;
        }
      });
    });
    return Object.entries(map)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [activeOrders, products]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch =
        o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Order status update logic
  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, status: newStatus };
          toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} marked as ${newStatus}`);
          return updated;
        }
        return o;
      })
    );
  };

  // Sparkline generator helper for sales cards
  const generateSparklinePoints = (width: number, height: number) => {
    const last7DaysData = [...chartData].slice(-7);
    const maxVal = Math.max(...last7DaysData.map(d => d.revenue), 20);
    const len = last7DaysData.length;
    return last7DaysData.map((d, i) => {
      const x = (i / (len - 1)) * width;
      const y = height - (d.revenue / maxVal) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Dynamic Inventory Alert Banner */}
      {(oos.length > 0 || lowStock.length > 0) && (
        <div style={alertBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 13, color: 'var(--color-stone)' }}>
              {oos.length > 0 && (
                <span>
                  <strong>Out of stock:</strong> {oos.length} products ({oos.map(p => p.name).slice(0, 3).join(', ')}
                  {oos.length > 3 ? '...' : ''}).{' '}
                </span>
              )}
              {lowStock.length > 0 && (
                <span>
                  <strong>Low stock alert:</strong> {lowStock.length} items require replenishment.
                </span>
              )}
            </div>
          </div>
          <Link href="/admin/products" style={alertAction}>
            Auditing & Replenishment →
          </Link>
        </div>
      )}

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Sales & Inventory
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-stone)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
            Live performance dashboard for Kgiants flagship aroma storefront.
          </p>
        </div>
        <div style={demoModeBadge}>Demo Mode Active (LocalStorage Synced)</div>
      </div>

      {/* Main KPI Stats Grid */}
      <div style={statsGrid}>
        {/* KPI Card: Revenue */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <span style={kpiLabel}>Net Revenue</span>
            <span style={{ ...kpiChangeBadge, background: 'var(--color-emerald-light)', color: 'var(--color-emerald)' }}>+14.8%</span>
          </div>
          <div style={kpiValue}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={kpiFooter}>
            <span style={kpiFooterText}>Last 7 days trend:</span>
            <svg width="60" height="20" style={{ overflow: 'visible' }}>
              <polyline fill="none" stroke="var(--color-emerald)" strokeWidth="1.5" points={generateSparklinePoints(60, 20)} />
            </svg>
          </div>
        </div>

        {/* KPI Card: Orders */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <span style={kpiLabel}>Total Orders</span>
            <span style={kpiMiniStatus}>{orders.filter(o => o.status === 'paid').length} paid · {orders.filter(o => o.status === 'fulfilled').length} shipped</span>
          </div>
          <div style={kpiValue}>{totalOrdersCount}</div>
          <div style={kpiFooter}>
            <span style={kpiFooterText}>Refunded or Cancelled: {orders.filter(o => o.status === 'refunded').length} orders</span>
          </div>
        </div>

        {/* KPI Card: Average Order Value */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <span style={kpiLabel}>Average Order (AOV)</span>
          </div>
          <div style={kpiValue}>${averageOrderValue.toFixed(2)}</div>
          <div style={kpiFooter}>
            <span style={kpiFooterText}>Target AOV: $120.00</span>
          </div>
        </div>

        {/* KPI Card: Stock Status */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <span style={kpiLabel}>Inventory Health</span>
            {oos.length > 0 && <span style={kpiOosCount}>{oos.length} OOS</span>}
          </div>
          <div style={{ ...kpiValue, color: oos.length > 0 ? 'var(--color-gold)' : 'var(--color-ink)' }}>
            {products.length - oos.length} / {products.length}
          </div>
          <div style={kpiFooter}>
            <span style={kpiFooterText}>{lowStock.length} items below low threshold</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Block */}
      <div style={analyticsGrid}>
        {/* Left Column: Interactive Pure-SVG Revenue Area Chart */}
        <div style={chartBox}>
          <div style={chartBoxHeader}>
            <div>
              <h3 style={chartBoxTitle}>Revenue Timeline</h3>
              <p style={chartBoxSubtitle}>Interactive overview of aggregate sales revenue</p>
            </div>
            <div style={timeframeTabs}>
              {(['7D', '4W', '6M'] as Timeframe[]).map(t => (
                <button
                  key={t}
                  style={{
                    ...timeframeTab,
                    background: timeframe === t ? 'var(--color-ink)' : 'transparent',
                    color: timeframe === t ? 'var(--color-cream)' : 'var(--color-stone)'
                  }}
                  onClick={() => { setTimeframe(t); setHoveredChartIndex(null); }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Area Chart */}
          <div style={{ position: 'relative', marginTop: 16 }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              width="100%"
              height="100%"
              style={{ overflow: 'visible', fontFamily: 'var(--font-body)', fontSize: 10 }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-emerald-accent)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--color-emerald-accent)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {gridLines.map((line, idx) => (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={line.y}
                    x2={chartWidth - paddingRight}
                    y2={line.y}
                    stroke="var(--color-border)"
                    strokeWidth="0.75"
                    strokeDasharray="4 4"
                  />
                  <text x={paddingLeft - 8} y={line.y + 4} textAnchor="end" fill="var(--color-stone-light)">
                    {line.label}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill="var(--color-stone)"
                  style={{ fontWeight: 300 }}
                >
                  {p.label}
                </text>
              ))}

              {/* Area Under Curve */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Line Above */}
              <path d={linePath} fill="none" stroke="var(--color-emerald)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Interactive Hover Nodes */}
              {points.map((p, idx) => (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredChartIndex(idx)}
                  onMouseLeave={() => setHoveredChartIndex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Invisible broad hitbox circle */}
                  <circle cx={p.x} cx-y={p.y} r="18" fill="transparent" />
                  
                  {/* Visual Node */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredChartIndex === idx ? 6 : 4}
                    fill={hoveredChartIndex === idx ? 'var(--color-emerald-accent)' : 'var(--color-white)'}
                    stroke="var(--color-emerald)"
                    strokeWidth={hoveredChartIndex === idx ? 2.5 : 1.5}
                    style={{ transition: 'r 0.15s ease-out, fill 0.15s ease-out' }}
                  />
                </g>
              ))}

              {/* Hover Indicator Vertical Line */}
              {hoveredChartIndex !== null && points[hoveredChartIndex] && (
                <line
                  x1={points[hoveredChartIndex].x}
                  y1={paddingTop}
                  x2={points[hoveredChartIndex].x}
                  y2={chartHeight - paddingBottom}
                  stroke="var(--color-emerald)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
            </svg>

            {/* Interactive Float Tooltip */}
            {hoveredChartIndex !== null && points[hoveredChartIndex] && (
              <div
                style={{
                  ...chartTooltip,
                  left: points[hoveredChartIndex].x - 65,
                  top: Math.max(10, points[hoveredChartIndex].y - 75)
                }}
              >
                <div style={tooltipDate}>{points[hoveredChartIndex].label}</div>
                <div style={tooltipRevenue}>${points[hoveredChartIndex].revenue.toFixed(2)}</div>
                <div style={tooltipOrders}>{points[hoveredChartIndex].ordersCount} orders</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Category Distribution & Scents */}
        <div style={distributionBox}>
          <div>
            <h3 style={chartBoxTitle}>Category Dominance</h3>
            <p style={chartBoxSubtitle}>Revenue contributions across product lines</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {categoryStats.map(cat => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, fontFamily: 'var(--font-body)' }}>
                  <span style={{ fontWeight: 400, color: 'var(--color-ink)' }}>{cat.name}</span>
                  <span style={{ fontWeight: 300, color: 'var(--color-stone)' }}>
                    ${cat.revenue.toFixed(2)} ({cat.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div style={progressContainer}>
                  <div style={{ ...progressBar, width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
            {categoryStats.length === 0 && (
              <div style={emptyDataState}>No sales records to compute category stats.</div>
            )}
          </div>

          <div style={{ marginTop: 24, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <h4 style={{ ...chartBoxTitle, fontSize: 13, marginBottom: 8 }}>Top Aroma Profiles (By Volume)</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {scentStats.map(s => (
                <div key={s.name} style={scentBadge}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 4 }}>× {s.qty}</span>
                </div>
              ))}
              {scentStats.length === 0 && (
                <div style={{ ...emptyDataState, padding: 8 }}>No aroma statistics.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sales Orders & Operations Table */}
      <div style={operationsBox}>
        <div style={operationsHeader}>
          <div>
            <h3 style={chartBoxTitle}>Sales Orders List</h3>
            <p style={chartBoxSubtitle}>Detailed log of customer checkout transactions</p>
          </div>
          <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 440 }}>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by ID or customer email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={searchInput}
            />
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={statusSelect}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Grid Orders Table */}
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={tbl}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--color-border)' }}>
                {['Order Reference', 'Customer Email', 'Items', 'Order Total', 'Checkout Date', 'Status', ''].map(col => (
                  <th key={col} style={th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                
                return (
                  <React.Fragment key={order.id}>
                    <tr
                      style={{
                        ...trRow,
                        background: isExpanded ? 'rgba(22, 51, 0, 0.03)' : 'transparent',
                        borderBottom: '1px solid var(--color-border)'
                      }}
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      <td style={{ ...td, fontWeight: 500 }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={td}>{order.customer_email}</td>
                      <td style={{ ...td, color: 'var(--color-stone)' }}>
                        {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                      </td>
                      <td style={{ ...td, fontWeight: 500 }}>${order.total.toFixed(2)}</td>
                      <td style={{ ...td, color: 'var(--color-stone)' }}>
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={td}>
                        <span style={badgeStyle(order.status)}>{order.status}</span>
                      </td>
                      <td style={{ ...td, textAlign: 'right', fontSize: 10, color: 'var(--color-stone)' }}>
                        {isExpanded ? '▲ Close Details' : '▼ View Details'}
                      </td>
                    </tr>
                    
                    {/* Expandable Order Inspector Drawer */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={expandedCell}>
                          <div style={inspectorContainer}>
                            {/* Columns Layout */}
                            <div style={inspectorColumns}>
                              {/* Left Info: Shipping details */}
                              <div style={inspectorCol}>
                                <h4 style={inspectorTitle}>Delivery & Shipping</h4>
                                <div style={inspectorDetailsList}>
                                  <div style={inspectorDetailItem}>
                                    <span style={detailLabel}>Receiver Name:</span>
                                    <span style={detailVal}>{order.shipping_address?.name || 'Customer'}</span>
                                  </div>
                                  <div style={inspectorDetailItem}>
                                    <span style={detailLabel}>Shipping Address:</span>
                                    <span style={detailVal}>
                                      {order.shipping_address?.line1 || '—'}, {order.shipping_address?.city || '—'}, {order.shipping_address?.state || '—'} {order.shipping_address?.zip || '—'}
                                    </span>
                                  </div>
                                  <div style={inspectorDetailItem}>
                                    <span style={detailLabel}>Service / Carrier:</span>
                                    <span style={detailVal}>{order.shipping_service || 'Standard Delivery'}</span>
                                  </div>
                                  <div style={inspectorDetailItem}>
                                    <span style={detailLabel}>Payment intent reference:</span>
                                    <span style={{ ...detailVal, fontFamily: 'monospace', fontSize: 10 }}>
                                      {order.stripe_payment_intent_id || '—'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Center Info: Items Details */}
                              <div style={{ ...inspectorCol, flex: 1.3 }}>
                                <h4 style={inspectorTitle}>Order Items</h4>
                                <div style={itemsList}>
                                  {order.items?.map(item => (
                                    <div key={item.id} style={itemRecord}>
                                      <div>
                                        <div style={itemName}>{item.product_name}</div>
                                        <div style={itemSubtext}>SKU: {item.product_id}</div>
                                      </div>
                                      <div style={itemTotals}>
                                        <span>{item.quantity} × ${item.unit_price.toFixed(2)}</span>
                                        <span style={{ fontWeight: 500 }}>${(item.unit_price * item.quantity).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Subtotals list */}
                                  <div style={subtotalSummary}>
                                    <div style={summaryRow}>
                                      <span>Subtotal</span>
                                      <span>${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div style={summaryRow}>
                                      <span>VAT (20%)</span>
                                      <span>${order.vat.toFixed(2)}</span>
                                    </div>
                                    <div style={summaryRow}>
                                      <span>Shipping Fee</span>
                                      <span>${order.shipping_fee.toFixed(2)}</span>
                                    </div>
                                    <div style={{ ...summaryRow, borderTop: '1px solid var(--color-border)', paddingTop: 6, fontWeight: 500, color: 'var(--color-ink)' }}>
                                      <span>Order Total</span>
                                      <span>${order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Info: Status Update Quick Controls */}
                              <div style={{ ...inspectorCol, minWidth: 160, borderLeft: '1px solid var(--color-border)', paddingLeft: 20 }}>
                                <h4 style={inspectorTitle}>Change Order Status</h4>
                                <p style={inspectorActionIntro}>Set status to update warehouse logs and client alerts:</p>
                                <div style={actionButtonList}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleOrderStatusChange(order.id, 'paid'); }}
                                    style={{
                                      ...actionBtn,
                                      border: order.status === 'paid' ? '1.5px solid var(--color-ink)' : '1px solid var(--color-border)',
                                      background: order.status === 'paid' ? 'var(--color-emerald-light)' : 'transparent',
                                      fontWeight: order.status === 'paid' ? 600 : 300
                                    }}
                                  >
                                    Paid
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleOrderStatusChange(order.id, 'fulfilled'); }}
                                    style={{
                                      ...actionBtn,
                                      border: order.status === 'fulfilled' ? '1.5px solid var(--color-ink)' : '1px solid var(--color-border)',
                                      background: order.status === 'fulfilled' ? 'var(--color-emerald-light)' : 'transparent',
                                      fontWeight: order.status === 'fulfilled' ? 600 : 300
                                    }}
                                  >
                                    Fulfilled / Shipped
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleOrderStatusChange(order.id, 'refunded'); }}
                                    style={{
                                      ...actionBtn,
                                      border: order.status === 'refunded' ? '1.5px solid var(--color-ink)' : '1px solid var(--color-border)',
                                      background: order.status === 'refunded' ? '#FEECEB' : 'transparent',
                                      color: order.status === 'refunded' ? '#C23A3A' : 'var(--color-ink)',
                                      fontWeight: order.status === 'refunded' ? 600 : 300
                                    }}
                                  >
                                    Refunded
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...td, textAlign: 'center', padding: '64px 0', color: 'var(--color-stone-light)' }}>
                    No checkout records match your search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Beautiful Styled CSS Styles ──────────────────────────────────────────────

const alertBanner: React.CSSProperties = {
  background: '#FFF9E6',
  border: '1px solid #FFEBB3',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 0,
  flexWrap: 'wrap',
  gap: 12
};

const alertAction: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-ink)',
  textDecoration: 'underline',
  letterSpacing: '0.04em',
  textTransform: 'uppercase'
};

const demoModeBadge: React.CSSProperties = {
  background: 'var(--color-emerald-light)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-emerald)',
  padding: '6px 12px',
  fontSize: 10,
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase'
};

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 20
};

const kpiCard: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 140,
  transition: 'transform 0.2s, box-shadow 0.2s',
  position: 'relative'
};

const kpiHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%'
};

const kpiLabel: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--color-stone-light)',
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase'
};

const kpiChangeBadge: React.CSSProperties = {
  fontSize: 9,
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  padding: '2px 6px',
  borderRadius: 4
};

const kpiMiniStatus: React.CSSProperties = {
  fontSize: 9,
  color: 'var(--color-stone-light)',
  fontFamily: 'var(--font-body)',
  fontWeight: 300
};

const kpiOosCount: React.CSSProperties = {
  fontSize: 9,
  background: '#FEECEB',
  color: '#C23A3A',
  padding: '2px 6px',
  fontWeight: 600,
  borderRadius: 4
};

const kpiValue: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 32,
  fontWeight: 300,
  letterSpacing: '-0.02em',
  marginTop: 8,
  marginBottom: 12,
  color: 'var(--color-ink)'
};

const kpiFooter: React.CSSProperties = {
  borderTop: '1px solid rgba(22, 51, 0, 0.05)',
  paddingTop: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%'
};

const kpiFooterText: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--color-stone)',
  fontFamily: 'var(--font-body)',
  fontWeight: 300
};

const analyticsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.7fr 1fr',
  gap: 20
};

const chartBox: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column'
};

const chartBoxHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  borderBottom: '1px solid rgba(22, 51, 0, 0.06)',
  paddingBottom: 16,
  marginBottom: 16
};

const chartBoxTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: 'var(--color-ink)',
  marginBottom: 4
};

const chartBoxSubtitle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 300,
  color: 'var(--color-stone)'
};

const timeframeTabs: React.CSSProperties = {
  display: 'flex',
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: 3,
  gap: 2
};

const timeframeTab: React.CSSProperties = {
  border: 'none',
  padding: '4px 10px',
  fontFamily: 'var(--font-body)',
  fontSize: 10,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.15s ease-out'
};

const chartTooltip: React.CSSProperties = {
  position: 'absolute',
  background: 'var(--color-ink)',
  color: 'var(--color-cream)',
  padding: '10px 14px',
  borderRadius: 8,
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 130,
  zIndex: 10,
  transition: 'left 0.15s ease-out, top 0.15s ease-out'
};

const tooltipDate: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  opacity: 0.6,
  fontFamily: 'var(--font-body)'
};

const tooltipRevenue: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  fontFamily: 'var(--font-display)'
};

const tooltipOrders: React.CSSProperties = {
  fontSize: 11,
  opacity: 0.8,
  fontFamily: 'var(--font-body)',
  fontWeight: 300
};

const distributionBox: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const progressContainer: React.CSSProperties = {
  background: 'var(--color-cream)',
  height: 6,
  width: '100%',
  overflow: 'hidden'
};

const progressBar: React.CSSProperties = {
  background: 'var(--color-emerald)',
  height: '100%',
  transition: 'width 0.5s ease-out'
};

const scentBadge: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '5px 12px',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 300,
  color: 'var(--color-stone)'
};

const emptyDataState: React.CSSProperties = {
  padding: '24px 0',
  textAlign: 'center',
  color: 'var(--color-stone-light)',
  fontSize: 12,
  fontStyle: 'italic',
  fontFamily: 'var(--font-body)'
};

const operationsBox: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column'
};

const operationsHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(22, 51, 0, 0.06)',
  paddingBottom: 16,
  marginBottom: 12,
  flexWrap: 'wrap',
  gap: 16
};

const searchInput: React.CSSProperties = {
  flex: 1,
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-ink)',
  outline: 'none'
};

const statusSelect: React.CSSProperties = {
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--color-ink)',
  cursor: 'pointer',
  outline: 'none'
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
  padding: '16px',
  color: 'var(--color-ink)',
  verticalAlign: 'middle'
};

const trRow: React.CSSProperties = {
  cursor: 'pointer',
  transition: 'background-color 150ms ease-out'
};

const expandedCell: React.CSSProperties = {
  padding: '20px 24px',
  background: 'rgba(22, 51, 0, 0.015)',
  borderBottom: '1px solid var(--color-border)'
};

const inspectorContainer: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 16
};

const inspectorColumns: React.CSSProperties = {
  display: 'flex',
  gap: 28,
  flexWrap: 'wrap'
};

const inspectorCol: React.CSSProperties = {
  flex: 1,
  minWidth: 220,
  display: 'flex',
  flexDirection: 'column',
  gap: 12
};

const inspectorTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--color-stone)',
  borderBottom: '1px solid rgba(22, 51, 0, 0.06)',
  paddingBottom: 6
};

const inspectorDetailsList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8
};

const inspectorDetailItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};

const detailLabel: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--color-stone-light)',
  fontFamily: 'var(--font-body)',
  fontWeight: 400
};

const detailVal: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--color-ink)',
  fontFamily: 'var(--font-body)',
  fontWeight: 300,
  lineHeight: 1.4
};

const itemsList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

const itemRecord: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px dashed var(--color-border)',
  paddingBottom: 8
};

const itemName: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: 'var(--color-ink)'
};

const itemSubtext: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--color-stone-light)'
};

const itemTotals: React.CSSProperties = {
  display: 'flex',
  gap: 20,
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  color: 'var(--color-ink)'
};

const subtotalSummary: React.CSSProperties = {
  background: 'var(--color-cream)',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginTop: 10
};

const summaryRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 12,
  color: 'var(--color-stone)',
  fontFamily: 'var(--font-body)'
};

const inspectorActionIntro: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--color-stone)',
  fontFamily: 'var(--font-body)',
  fontWeight: 300,
  lineHeight: 1.4
};

const actionButtonList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8
};

const actionBtn: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  background: 'transparent',
  textAlign: 'center',
  transition: 'all 0.15s ease-out'
};

function badgeStyle(status: Order['status']): React.CSSProperties {
  let color = 'var(--color-stone)';
  let bg = 'transparent';
  let border = '1px solid var(--color-border)';

  if (status === 'paid') {
    color = 'var(--color-emerald)';
    bg = 'var(--color-emerald-light)';
    border = '1.5px solid rgba(22, 51, 0, 0.2)';
  } else if (status === 'fulfilled') {
    color = 'var(--color-white)';
    bg = 'var(--color-emerald)';
    border = '1px solid var(--color-emerald)';
  } else if (status === 'refunded') {
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
