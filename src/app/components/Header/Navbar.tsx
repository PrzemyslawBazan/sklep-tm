'use client';

import React, { useState } from 'react';
import { User, Menu, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { navBarAdmin, navBarPath } from './menu.data';
import LogoSvg from '../../utils/LOGO.svg'; 
import { AuthButtons } from './AuthButtons';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleAuthClick = (): void => {
    if (user) {
      router.push('/panel');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-custom-beige px-4 sm:px-6 py-2 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <a href="/" className="flex items-center">
              <Image 
                src={LogoSvg}
                alt="Tax & Money Logo" 
                width={120} 
                height={50}
                className="w-[100px] h-[40px] sm:w-[120px] sm:h-[50px] object-contain"
                priority
              />
            </a>
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navBarPath.map((item, index) => (
                <div key={index} className="text-gray-700 hover:text-gray-900 font-medium">
                  <Link href={item.url}>
                    {item.name}
                  </Link>
                </div>
              ))}
              {isAdmin && navBarAdmin.map((item, index) => (
                <div key={index} className="text-gray-700 hover:text-gray-900 font-medium">
                  <Link href={item.url}>
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href={"https://taxm.pl/konsultacja/"} className="bg-blue-600 text-white px-4 xl:px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors text-sm xl:text-base">
              Konsultacje księgowe
            </Link>
            
            <AuthButtons />
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
            <div className="px-4 py-4 space-y-3">
              {navBarPath.map((item, index) => (
                <div key={index} className="text-gray-700 hover:text-gray-900 font-medium">
                  <Link href={item.url}>
                    {item.name}
                  </Link>
                </div>
              ))}
              {isAdmin && navBarAdmin.map((item, index) => (
                <div key={index} className="text-gray-700 hover:text-gray-900 font-medium">
                  <Link href={item.url}>
                    {item.name}
                  </Link>
                </div>
              ))}
              
              <div className="pt-4 space-y-3 border-t">
                <button className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors" onClick={() => {router.push("https://taxm.pl/kontakt"); }}>
                  Konsultacje księgowe
                </button>
                
                <button 
                  onClick={handleAuthClick}
                  className="w-full bg-red-500 text-white px-4 py-2.5 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>{user ? 'Twoje konto' : 'Zaloguj się'}</span>
                </button>

                {user && (
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-full font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Wyloguj się</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

