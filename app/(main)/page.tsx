'use client';

import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { getCatalogWithProducts } from '@/actions/catalog/getCatalogWithProducts';

import ProductCatalog from '@/components/productCatalog';
import { ICatalog } from '@/types/catalog';
import { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

const HeaderSlider = () => {
  const originalSlides = [
    {
      id: 1,
      title: "Feel the COLD - Air conditioning offers",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 3,
      title: "Power with elegance - Minisplit SMART",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const sliderData = [
    originalSlides[originalSlides.length - 1], // clone last
    ...originalSlides,
    originalSlides[0], // clone first
  ];

  const [currentSlide, setCurrentSlide] = useState(1); // start at the real first
  const [transitioning, setTransitioning] = useState(true);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSlide === sliderData.length - 1) {
      setTimeout(() => {
        setTransitioning(false);
        setCurrentSlide(1); // jump to real first
      }, 700); // match transition duration
    } else if (currentSlide === 0) {
      setTimeout(() => {
        setTransitioning(false);
        setCurrentSlide(sliderData.length - 2); // jump to real last
      }, 700);
    } else {
      setTransitioning(true);
    }
  }, [currentSlide]);

  const handleSlideChange = (index: number) => {
    setTransitioning(true);
    setCurrentSlide(index + 1); // compensate for cloned first
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        ref={slideRef}
        className={`flex ${transitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {originalSlides.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index + 1 ? "bg-[#00B2EF]" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState<ICatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const catalogs = await getCatalogWithProducts();

      if (catalogs?.length) {
        const transformedCatalogs = catalogs.map((catalog) => ({
          ...catalog,
          catalogProducts: {
            items: catalog.catalogProducts.items.map(
              (item: { localizeInfos: { title: string } }) => ({
                ...item,
                localizeInfos: {
                  title: item.localizeInfos?.title || 'Default Title',
                },
              })
            ),
          },
        }));
        setProducts(transformedCatalogs);
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <div>
      <HeaderSlider />
      <main>
        {isLoading && (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#00FCF7]'></div>
          </div>
        )}
        {products.map((catalog) => (
          <ProductCatalog
            key={catalog?.id}
            title={catalog?.localizeInfos?.title as string}
            products={
              catalog.catalogProducts.items as unknown as IProductsEntity[]
            }
          />
        ))}
      </main>
    </div>
  );
}