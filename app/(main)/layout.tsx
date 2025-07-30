import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React from 'react';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=''>
      <Navbar />
      <div className='pb-10'>{children}</div>
      <Footer />
    </div>
  );
};

export default layout;