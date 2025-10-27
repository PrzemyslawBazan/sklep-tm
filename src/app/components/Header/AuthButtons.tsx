import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

export function AuthButtons() {
    const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleAuthClick = (): void => {
    if (user) {
      router.push('/panel');
    } else {
      router.push('/login');
    }
  };

   const { mutate } = useMutation({
    mutationKey: ["auth"],
    mutationFn: () => logout(),
    onSuccess() {
        router.push("/")
    },
    onError(err) {
        console.log(err)
    } 
   })

  const handleLogout = async (): Promise<void> => {
    mutate()
  };

  if (!user) {
    return (
      <button
        onClick={handleAuthClick}
        className="bg-red-500 text-white px-4 xl:px-6 py-2 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 text-sm xl:text-base"
      >
        Zaloguj się
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
      >
        <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center font-medium hover:bg-red-600 transition-colors">
            Twoje Konto
        </div>
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            {user.email}
          </div>
          <button
            onClick={() => {
              setIsUserMenuOpen(false);
              router.push('/panel');
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Moje konto
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Wyloguj się</span>
          </button>
        </div>
      )}
    </div>
  );

    
}


