import React from 'react';
import Link from 'next/link';
import { getProductById, getProducts } from '@/lib/supabase';
import AddToCartButton from './AddToCartButton';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import ScrollGallery from './ScrollGallery';
import ProductDetails from './ProductDetails';
import styles from './product.module.css';

type PageParams = Promise<{ id: string }>;

export default async function ProductPage(props: { params: PageParams }) {
  const params = await props.params;
  if (!params?.id) return <div>Missing identifier</div>;

  const [product, allProducts] = await Promise.all([
    getProductById(params.id),
    getProducts(),
  ]);

  const relatedProducts = allProducts.filter(p => p.id !== params.id).slice(0, 4);

  if (!product) {
    return (
      <div className={styles.wrapper} style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: 'rgba(22,51,0,0.4)', fontSize: 13, marginBottom: 16 }}>
          Product not found
        </p>
        <Link href="/shop" style={{ color: '#163300', fontSize: 13, textDecoration: 'underline' }}>
          Back to shop
        </Link>
      </div>
    );
  }

  const shortName = product.name.split('—')[1]?.trim() || product.name;
  const images = product.images?.length ? product.images : [product.image_url];

  return (
    <div className={styles.wrapper}>

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className={styles.breadcrumbCurrent}>{shortName}</span>
      </nav>

      {/* Main grid */}
      <div className={styles.grid}>
        <ScrollGallery images={images} name={product.name} />
        <ProductDetails product={product} shortName={shortName}>
          <AddToCartButton product={product} />
        </ProductDetails>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedHeading}>You may also like</h2>
            <Link href="/shop" className={styles.relatedLink}>
              View all
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
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
