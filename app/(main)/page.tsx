 'use client';

 import { Button } from '@/components/ui/button';

 import { ArrowRight } from 'lucide-react';

 import { useEffect, useState } from 'react';

 import { getCatalogWithProducts } from '@/actions/catalog/getCatalogWithProducts';

 import ProductCatalog from '@/components/ProductCatalog';

 import { ICatalog } from '@/types/catalog';

 export default function HomePage() {
   const [products, setProducts] = useState<ICatalog[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const catalogs = await getCatalogWithProducts();

      //@ts-ignore 

      if (catalogs?.length) setProducts(catalogs);

      setIsLoading(false);
    };

    getData();
  }, []);

  return (
    <div className='min-h-screen'>
      <main className='container mx-auto px-4 py-8'>
        <section className='mb-12'>
          <div className='relative overflow-hidden rounded-lg shadow-lg'>
            <div className='w-full h-[400px] relative'>
              <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-8'>
                <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent z-3'>
                  Welcome to our Store!
                  </h2>
              
              <p className='text-xl mb-8 text-gray-700 z-4'>
                Discover the best products just for you
                fovorite products osi porque yo lo digo
                explore!
              </p>

              <img
              src='https://assets.entrepreneur.com/content/3x2/2000/20105812074510-OnlineShopping.jpeg?format=pjpeg&auto=webp&crop=16:9&width=675&height=380'
              alt='Hero Image'
              className='absolute inset-0 w-full h-full object-cover opacity-20 z-1'
              />

              <Button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white z-0 cursor-pointer'>
                Shop Now
                <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
                </div>
                </div>
                </div>
                </section>

                {isLoading && (
                  <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
                    </div>
                )}

                {products.map((catalog) => (
                  <ProductCatalog
                  key={catalog?.id}
                  title={catalog?.localizeInfos?.title}
                  products={catalog.catalogProducts.items}
                  />
                ))}
                </main>
                </div>
  );
}