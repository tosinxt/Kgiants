import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { getProductById } from '@/lib/supabase';
import AddToCartButton from './AddToCartButton';
import styles from './product.module.css';

type PageParams = Promise<{ id: string }>;

export default async function ProductPage(props: { params: PageParams }) {
  const params = await props.params;
  if (!params?.id) return <div>Missing identifier</div>;
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product Not Found</h1>
        <p>We couldn&apos;t find the product you are looking for.</p>
        <Link href="/" style={{marginTop: '1rem', display: 'inline-block', textDecoration: 'underline'}}>
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} container`}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Shop
      </Link>

      <div className={styles.grid}>
        <div className={styles.imageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.image_url} 
            alt={product.name} 
            className={styles.mainImage}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
          
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.actions}>
             <AddToCartButton product={product} />
          </div>

          <div className={styles.meta}>
            <div className={styles.metaRow} style={{marginBottom: '1rem'}}>
              <Truck size={18} className="text-muted" />
              <span>Complimentary express shipping on all orders.</span>
            </div>
            <div className={styles.metaRow}>
              <ShieldCheck size={18} className="text-muted" />
              <span>Includes 2-year extended manufacturer warranty.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
