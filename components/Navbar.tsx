'use client';

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import getUserSession from '@/actions/auth/getUserSession';
import logoutAction from '@/actions/auth/logout';
import { useRouter } from 'next/navigation';
import { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import useCartStore from '@/stores/cartStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<IUserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const userData = await getUserSession();
        if (userData) setUser(userData as IUserEntity);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setUser(null);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Close navbar when clicking outside of it or any item in it (except search)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/');
    setUser(null);
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length) {
      router.push(`/search?searchTerm=${searchQuery}`);
      setIsMobileMenuOpen(false); // Close mobile menu on search
    }
  };

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu on item click
  };

  return (
    <nav>
      <div className='max-w-auto mx-auto px-4 sm:px-6 lg:px-8 border-b-2 border-gray-200 bg-[#0066D7]'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="lupa"
      />
          </div>
          <div className='hidden md:flex items-center space-x-4 '>
            <div className='mr-64'>
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded px-3 py-1 min-w-60">
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='bg-gray-100 outline-none flex-grow pr-2 border-none shadow-none focus:shadow-none focus:outline-none focus:ring-0 w-96'
                />
              <span className="mx-2 text-gray-300">|</span>
                 <Image
                  className="w-4 h-4"
                  src={assets.lupa}
                  alt="logo"
                     />
                </div>
             </form>
            </div>

            <div>
              <Link href='/cart' onClick={handleMenuItemClick}>
                <Button
                  size='icon'
                  className='relative bg-transparent hover:bg-transparent cursor-pointer pt-2'
                  variant='ghost'
                >
                  <ShoppingCart className='h-5 w-5 text-white' />
                  {cartItems.length > 0 && (
                    <span className='absolute top-[-3px] right-[-3px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#00B2EF] rounded-full'>
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
            {isLoading && (
              <div className='flex items-center'>
                <Avatar className='h-8 w-8 cursor-pointer'>
                  <AvatarFallback className='bg-[#00B2EF] text-white'>
                    -
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8 cursor-pointer'>
                      <AvatarFallback className='bg-[#00B2EF] text-white'>
                        {user.formData
                          .find(
                            (f): f is { marker: 'name'; value: string } =>
                              f.marker === 'name'
                          )
                          ?.value.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 ' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none bg-[#0066D7] bg-clip-text text-transparent'>
                        {
                          user.formData.find(
                            (f): f is { marker: 'name'; value: string } =>
                              f.marker === 'name'
                          )?.value
                        }
                      </p>
                      <p className='text-xs leading-none text-gray-400'>
                        {user?.identifier}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className='bg-[#00B2EF]' />
                  <DropdownMenuItem className='focus:text-[#28bdeb]'>
                    <Link href='/profile' className='flex w-full'>
                      <User className='mr-2 h-4 w-4' />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className='focus:text-[#28bdeb]'>
                    <Link href='/orders' className='flex w-full'>
                      <ShoppingCart className='mr-2 h-4 w-4' />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='bg-[#00B2EF]' />
                  <DropdownMenuItem
                    className=' focus:text-[#28bdeb] cursor-pointer'
                    onClick={handleLogout}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!user && isLoading === false && (
              <div className='flex space-x-2'>
                <div>
                  <Link href='/auth?type=login'>
                    <Button
                      className='text-white bg-[#0066D7] cursor-pointer hover:!bg-[#0066D7] hover:!text-white'
                    >
                      Login
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href='/auth?type=signup'>
                    <Button className='text-white bg-[#0066D7] cursor-pointer hover:!bg-[#0066D7] hover:!text-white'>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className='md:hidden flex items-center'>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className='h-6 w-6 text-gray-300' />
              ) : (
                <Menu className='h-6 w-6 text-gray-300' />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className='md:hidden bg-gray-100'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <form onSubmit={handleSearch} className='mb-4'>
              <Input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-white  '
              />
            </form>

            <Link
              href='/cart'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-[#00B2EF]'
              onClick={handleMenuItemClick}
            >
              Cart
            </Link>
          </div>
          <div className='border-t border-gray-700 pt-4 pb-3'>
            {user && (
              <div className='flex items-center px-5 mb-3'>
                <div className='flex-shrink-0'>
                  <Avatar className='h-8 w-8 border-2 border-gray-700'>
                    <AvatarFallback>
                      {user.formData
                        .find(
                          (f): f is { marker: 'name'; value: string } =>
                            f.marker === 'name'
                        )
                        ?.value.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='ml-3'>
                  <div className='text-base font-medium bg-[#00B2EF] bg-clip-text text-transparent'>
                    {
                      user.formData.find(
                        (f): f is { marker: 'name'; value: string } =>
                          f.marker === 'name'
                      )?.value
                    }
                  </div>
                  <div className='text-sm font-medium text-gray-500'>
                    {user?.identifier}
                  </div>
                </div>
              </div>
            )}
            {user ? (
              <div className='mt-3 px-2 space-y-1'>
                <Link
                  href='/profile'
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-[#00B2EF]'
                  onClick={handleMenuItemClick}
                >
                  Your Profile
                </Link>

                <Link
                  href='/orders'
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-[#00B2EF]'
                  onClick={handleMenuItemClick}
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-[#00B2EF] w-full text-left cursor-pointer'
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className='mt-3 px-2 space-y-1'>
                <Link
                  href='/auth?type=login'
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#00B2EF]'
                  onClick={handleMenuItemClick}
                >
                  Login
                </Link>
                <Link
                  href='/auth?type=signup'
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#00B2EF]'
                  onClick={handleMenuItemClick}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}