import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

export function AuthButtons() {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthClick = (): void => {
    if (user) {
      router.push('/panel');
    } else {
      router.push('/login');
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ['auth'],
    mutationFn: () => logout(),
    onSuccess() {
      setIsUserMenuOpen(false);
      router.push('/');
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleLogout = async (): Promise<void> => {
    mutate();
  };

  // Not logged in - show login button
  if (!user) {
    return (
      <button
        onClick={handleAuthClick}
        className="inline-flex items-center justify-center gap-2 h-9 px-4
                 bg-white text-zinc-700 text-sm font-medium
                 border border-zinc-300 rounded-md
                 transition-colors duration-150
                 hover:bg-zinc-50 hover:border-zinc-400
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
      >
        <User className="w-4 h-4" />
        Zaloguj się
      </button>
    );
  }

  // Logged in - show dropdown
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className={`
          inline-flex items-center justify-center gap-2 h-9 px-4
          text-sm font-medium rounded-md
          transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2
          ${isUserMenuOpen 
            ? 'bg-zinc-100 text-zinc-900' 
            : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400'
          }
        `}
      >
        <User className="w-4 h-4" />
        <span>Twoje Konto</span>
        <ChevronDown 
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 
            ${isUserMenuOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute right-0 mt-2 w-56
          bg-white rounded-md shadow-lg border border-zinc-200
          py-1 z-50
          transition-all duration-150 origin-top-right
          ${isUserMenuOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-95 pointer-events-none'
          }
        `}
      >
        {/* User Info */}
        <div className="px-3 py-2 border-b border-zinc-100">
          <p className="text-sm font-medium text-zinc-900 truncate">
            {user.email}
          </p>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <button
            onClick={() => {
              setIsUserMenuOpen(false);
              router.push('/panel');
            }}
            className="flex items-center gap-2 w-full px-3 py-2
                     text-sm text-zinc-700
                     transition-colors duration-150
                     hover:bg-zinc-100 hover:text-zinc-900"
          >
            <User className="w-4 h-4 text-zinc-500" />
            Moje konto
          </button>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 w-full px-3 py-2
                     text-sm text-zinc-700
                     transition-colors duration-150
                     hover:bg-zinc-100 hover:text-zinc-900
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4 text-zinc-500" />
            {isPending ? 'Wylogowywanie...' : 'Wyloguj się'}
          </button>
        </div>
      </div>
    </div>
  );
}