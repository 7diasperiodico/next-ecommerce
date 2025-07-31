'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useCartStore from '@/stores/cartStore';
import { getProductDetails } from '@/actions/catalog/getProductDetails';
import ProductCatalog from '@/components/productCatalog';
import { getRelatedProducts } from '@/actions/catalog/getRelatedProducts';
import { toast } from 'sonner';
import { IProduct } from '@/types/product';
import { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const unwrapParams = async () => {
      const { productId } = await paramsPromise;
      setProductId(productId);
    };
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        const productData = await getProductDetails(parseInt(productId));
        setProduct(productData as unknown as IProduct);

        if (productData?.productPages?.[0]?.pageId && productId) {
          const relatedProductsData = await getRelatedProducts(
            parseInt(productData.productPages[0].pageId, 10),
            parseInt(productId, 10)
          );
          setRelatedProducts(relatedProductsData);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.attributeValues.p_title.value || 'Product',
        price: product.attributeValues.p_price.value,
        quantity: 1,
        image: product.attributeValues.p_image.value.downloadLink,
      });
      toast('Added to Cart', {
        description: `${product.attributeValues.p_title.value} has been added to your cart.`,
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className=' flex items-center justify-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#00FCF7]'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <main className='container mx-auto px-4 py-8'>
        <button
          className='mb-8 flex items-center text-[#0066D7] transition-colors duration-300 cursor-pointer'
          onClick={() => router.back()}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Back
        </button>

        {/* Product details */}
        <div className='grid md:grid-cols-2 gap-8'>
          <div className='relative overflow-hidden rounded-lg '>
            <img
              src={product?.attributeValues?.p_image?.value?.downloadLink || ''}
              alt={product?.attributeValues?.p_title?.value || 'Product Image'}
              className='object-contain w-full max-h-[400px] transition-transform duration-300 transform hover:scale-105'
            />
          </div>

          <div className='space-y-6'>
            <h1 className='text-3xl font-bold bg-black bg-clip-text text-transparent'>
              {product?.attributeValues?.p_title?.value || 'Product Title'}
            </h1>

            <p className='text-xl font-semibold text-gray-700'>
              ${product?.attributeValues?.p_price?.value?.toFixed(2) || '0.00'}
            </p>
            <div
              className='text-gray-500'
              dangerouslySetInnerHTML={{
                __html:
                  product?.attributeValues?.p_description?.value?.[0]
                    ?.htmlValue || '',
              }}
            />

    <div className='flex flex-col space-y-2'>
      <Button
        className='bg-[#0066D7] hover:bg-blue-800 text-white font-semibold cursor-pointer'
        onClick={handleAddToCart}
      >
        <ShoppingCart className='mr-2 h-5 w-5' />
        Add to Cart
      </Button>

    <a
       href="https://wa.me/5215555555555?text=Hola%2C%20quiero%20agendar%20una%20instalaci%C3%B3n"
       className="text-lg text-[#0066D7] text-center no-underline"
       target="_blank"
       rel="noopener noreferrer"
    >
      Agenda la instalación
    </a>
            </div>
          </div>
        </div>      

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className='mt-16'>
            <ProductCatalog
              title='Related Products'
              products={relatedProducts as unknown as IProductsEntity[]}
            />
          </section>
        )}
      </main>
    </div>
  );
}