import React from 'react';
import { getProductById, getProducts } from '@/lib/supabase';
import AddToCartButton from './AddToCartButton';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import styles from './product.module.css';

type PageParams = Promise<{ id: string }>;

export default async function ProductPage(props: { params: PageParams }) {
  const params = await props.params;
  if (!params?.id) return <div>Missing identifier</div>;
  const product = await getProductById(params.id);
  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter(p => p.id !== params.id).slice(0, 4);

  if (!product) {
    return (
      <div className={styles.wrapper} style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--color-stone)' }}>
          Product Not Found
        </h1>
        <a href="/shop" style={{ color: 'var(--color-stone)', textDecoration: 'underline', fontSize: 13, fontFamily: 'var(--font-body)' }}>
          Back to Shop
        </a>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {/* Left: image */}
        <div className={styles.imageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.mainImage}
          />
          {product.images && product.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 'var(--spacing-24)', left: 'var(--spacing-24)', display: 'flex', gap: 8 }}>
              {product.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  style={{ width: 48, height: 48, objectFit: 'contain', padding: 4, border: '1px solid var(--color-border)', cursor: 'pointer', background: 'var(--color-cream)', opacity: i === 0 ? 1 : 0.5 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className={styles.details}>
          <div className={styles.topRow}>
            <span>{product.category}</span>
            <span>{product.sku}</span>
          </div>

          <h1 className={styles.title}>
            {product.name.split('—')[1]?.trim() || product.name}
          </h1>

          {product.scent && (
            <div className={styles.scent}>{product.scent}</div>
          )}

          <div className={styles.price}>
            {product.variants ? `From $${product.variants[0].price.toFixed(2)}` : `$${product.price.toFixed(2)}`}
          </div>

          <p className={styles.description}>{product.description}</p>

          {product.inspired_by && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--spacing-32)' }}>
              Inspired by {product.inspired_by}
            </p>
          )}

          <AddToCartButton product={product} />

          {/* Accordions */}
          <div className={styles.accordions}>
            {product.features && product.features.length > 0 && (
              <Accordion title="Features">
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {product.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--color-stone)', lineHeight: 1.6, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      <span style={{ color: 'var(--color-stone-light)', flexShrink: 0 }}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Accordion>
            )}

            {product.scent_notes && (
              <Accordion title="Scent Notes">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(['top', 'middle', 'base'] as const).map(layer => (
                    product.scent_notes![layer].length > 0 && (
                      <div key={layer} style={{ display: 'flex', gap: 24, fontSize: 14, fontFamily: 'var(--font-body)' }}>
                        <span style={{ color: 'var(--color-stone-light)', width: 52, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10, fontWeight: 500, paddingTop: 2 }}>
                          {layer}
                        </span>
                        <span style={{ color: 'var(--color-stone)', fontWeight: 300 }}>
                          {product.scent_notes![layer].join(', ')}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </Accordion>
            )}

            {product.compatible_with && product.compatible_with.length > 0 && (
              <Accordion title="Compatible With">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.compatible_with.map(item => (
                    <span
                      key={item}
                      style={{
                        padding: '4px 12px',
                        border: '1px solid var(--color-border)',
                        fontSize: 12,
                        color: 'var(--color-stone)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 300,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Accordion>
            )}

            {product.caution && (
              <Accordion title="Caution">
                <p style={{ fontSize: 13, color: 'var(--color-stone)', lineHeight: 1.65, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                  {product.caution}
                </p>
              </Accordion>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>You may also like</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="pdp-accordion">
      <summary style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--spacing-20) 0',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--color-ink)',
        listStyle: 'none',
      }}>
        <span>{title}</span>
        <span className="pdp-accordion-icon" />
      </summary>
      <div style={{ paddingBottom: 'var(--spacing-20)' }}>
        {children}
      </div>
    </details>
  );
}
