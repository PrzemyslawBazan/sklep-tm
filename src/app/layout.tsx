import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Header/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { Providers } from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sklep Tax&Money',
  description: 'Profesjonalne usługi prawne i księgowe online',
  icons: {
      icon: '/tax_money_logo.png'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="bg-custom-beige">

        <AuthProvider>
          <Providers>
          <Navbar />
        {children}
        </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
