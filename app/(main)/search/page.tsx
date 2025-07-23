 'use client';

import { useState, useEffect } from 'react';

import { searchProductsAction } from '@/actions/catalog/searchProducts';

import { useSearchParams } from 'next/navigation';

import ProductCard from '@/components/productCard';

import { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

  const params = useSearchParams();

  const urlSearchTerm = params.get('searchTerm');

  const [products, setProducts] = useState<IProductsEntity[]>([]);

  useEffect(() => {
    const searchProducts = async () => {
      if (urlSearchTerm) {
        setIsLoading(true);

        const data = await searchProductsAction({ query: urlSearchTerm });

        console.log('data', data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Error fetching products:', data);
        }

        setIsLoading(false);
      }
    };

    searchProducts();
  }, [urlSearchTerm]);

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {isLoading ? (
            <div className='flex justify-center items-center h-64 w-full'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
            </div>
          ) : (
            <div
              key='products'
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`}
            >
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}