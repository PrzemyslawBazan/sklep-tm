'use client';

import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { navBarAdmin, navBarPath } from './menu.data';
import LogoSvg from '../../utils/LOGO.svg'; 
import { AuthButtons } from './AuthButtons';
import { useClearCartOnLogout } from '@/app/contexts/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();

  const clearCartOnLogout = useClearCartOnLogout();
  // Scroll detection for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = (): void => {
    if (user) {
      router.push('/panel');
    } else {
      router.push('/login');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      clearCartOnLogout();
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav 
      className={`
        sticky top-0 z-50 w-full px-4 sm:px-6
        transition-all duration-200
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm' 
          : 'bg-white border-b border-zinc-100'
        }
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Nav Links */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image 
                src={LogoSvg}
                alt="Tax & Money Logo" 
                width={120} 
                height={50}
                className="w-[100px] h-[40px] sm:w-[120px] sm:h-[50px] object-contain"
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 ml-10">
              {navBarPath.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.url}
                  className="px-3 py-2 text-sm font-medium text-zinc-600 rounded-md
                           transition-colors duration-150
                           hover:text-zinc-900 hover:bg-zinc-100"
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && navBarAdmin.map((item, index) => (
                <Link 
                  key={`admin-${index}`} 
                  href={item.url}
                  className="px-3 py-2 text-sm font-medium text-zinc-600 rounded-md
                           transition-colors duration-150
                           hover:text-zinc-900 hover:bg-zinc-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link 
              href="https://taxm.pl/konsultacja/" 
              className="inline-flex items-center justify-center h-9 px-4
                       bg-blue-600 text-white text-sm font-medium
                       rounded-md
                       transition-colors duration-150
                       hover:bg-blue-700"
            >
              Konsultacje księgowe
            </Link>
            
            <AuthButtons />
          </div>

          {/* Mobile Menu Button - Animated Hamburger */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10
                     text-zinc-700 rounded-md
                     transition-colors duration-150
                     hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4">
              <span
                className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-200
                  ${isMenuOpen ? 'top-[7px] rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 top-[7px] w-5 h-0.5 bg-current rounded-full transition-all duration-200
                  ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-200
                  ${isMenuOpen ? 'top-[7px] -rotate-45' : 'top-[14px]'}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            lg:hidden overflow-hidden transition-all duration-200 ease-out
            ${isMenuOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="pt-2 space-y-1">
            {navBarPath.map((item, index) => (
              <Link 
                key={index} 
                href={item.url}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3
                         text-sm font-medium text-zinc-700 rounded-md
                         transition-colors duration-150
                         hover:bg-zinc-100"
              >
                {item.name}
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            ))}
            {isAdmin && (
              <>
                <div className="pt-3 pb-1 px-3">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                {navBarAdmin.map((item, index) => (
                  <Link 
                    key={`admin-${index}`} 
                    href={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3
                             text-sm font-medium text-zinc-700 rounded-md
                             transition-colors duration-150
                             hover:bg-zinc-100"
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>
                ))}
              </>
            )}
            
            {/* Mobile Action Buttons */}
            <div className="pt-4 mt-2 space-y-2 border-t border-zinc-100">
              <Link 
                href="https://taxm.pl/konsultacja/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center w-full h-11
                         bg-blue-600 text-white text-sm font-medium
                         rounded-md
                         transition-colors duration-150
                         hover:bg-blue-700"
              >
                Konsultacje księgowe
              </Link>
              
              <button 
                onClick={handleAuthClick}
                className="flex items-center justify-center gap-2 w-full h-11
                         bg-white text-zinc-700 text-sm font-medium
                         border border-zinc-300 rounded-md
                         transition-colors duration-150
                         hover:bg-zinc-50 hover:border-zinc-400"
              >
                <User className="w-4 h-4" />
                <span>{user ? 'Twoje konto' : 'Zaloguj się'}</span>
              </button>

              {user && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full h-11
                           text-zinc-600 text-sm font-medium rounded-md
                           transition-colors duration-150
                           hover:bg-zinc-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Wyloguj się</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}