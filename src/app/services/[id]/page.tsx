'use client';

import { useParams, useRouter } from 'next/navigation';
import { useServices } from '../../hooks/useServices';
import { useAddToCart, useTotalItems } from '../../contexts/CartContext';

import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import serviceImage from '../../utils/img/service.png';
import { AddToCartButton } from '@/app/components/Buttons/CartButton/AddToCartButton';
import { useState } from 'react';


export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user} = useAuth();
  const { data: services = [], isLoading, isError } = useServices();
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useAddToCart();
  const totalItems = useTotalItems();
  const serviceId = params.id as string;
  console.log(serviceId)
  const service = services.find(s => s.id === serviceId);
  console.log(service)

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usługa nie została znaleziona</h2>
          <p className="text-gray-600 mb-6">
            Przepraszamy, nie możemy znaleźć tej usługi.
          </p>
          <button 
            onClick={goBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Powrót
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-beige">
       <div className="fixed md:bottom-6 md:right-6 bottom-4 right-4 z-50">
      <button
            onClick={goToCart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Shopping cart with ${totalItems} items`}
            className="group relative inline-flex items-center justify-center gap-2.5 
                       h-11 px-5 
                       bg-zinc-900 hover:bg-zinc-800 
                       border border-zinc-800 hover:border-zinc-700
                       rounded-xl
                       text-zinc-100
                       shadow-lg shadow-black/20
                       transition-all duration-200 ease-out
                       hover:shadow-xl hover:shadow-black/30
                       hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <svg
              className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>

            <span className="text-sm font-medium">Koszyk</span>

            {totalItems > 0 && (
              <span
                className="inline-flex items-center justify-center 
                           min-w-[1.375rem] h-[1.375rem] px-1.5
                           bg-emerald-500 
                           text-zinc-950 text-xs font-semibold
                           rounded-full
                           transition-transform duration-200
                           group-hover:scale-110"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <button onClick={() => router.push('/')} className="hover:text-gray-800">
              Strona główna
            </button>
            <span className="mx-1">/</span>
            <button onClick={() => router.push('/')} className="hover:text-gray-800">
              Usługi i rozwiązania
            </button>
            <span className="mx-1">/</span>
            <span className="text-gray-800">{service.category}</span>
          </div>
        </div>
        <div className="bg-custom-beige rounded-lg shadow-sm overflow-hidden">
          <div className="flex">
            <div className="w-80 h-64 flex-shrink-0">
                <Image
                    src={serviceImage}
                    alt='service image'
                    className="object-contain"
                    priority
                />
            </div>
            <div className="flex-1 p-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Cena:</span>
                  <span className="ml-2 text-lg font-semibold">
                    {formatPrice(service.price, service.currency)} + VAT
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Czas realizacji:</span>
                  <span className="ml-2">od {service.start_time ?? "-"} do {service.finish_time ?? "-"} dni</span>
                </div>
              </div>

              <AddToCartButton
                onClick={() => addToCart(service, user?.id)}
                ariaLabel={`Dodaj usługę ${service.name} do koszyka`}
              />

            </div>
          </div>

          <div className="p-6 pt-0">
            {service.overview && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Opis usługi:</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">{service.overview}</p>
                {service.overview_points && service.overview_points.length > 0 && (
                  <ul className="space-y-1 text-gray-700">
                    {service.overview_points.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {service.steps && service.steps.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Jak będzie przebiegać usługa?</h2>
                <ol className="space-y-1 text-gray-700">
                  {service.steps.map((step, i) => (
                    <li key={i}>{i + 1}. {step}</li>
                  ))}
                </ol>
              </div> // test
            )}

            {service.requirements && service.requirements.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Co musisz przygotować?</h2>
                <ul className="space-y-1 text-gray-700">
                  {service.requirements.map((req, i) => (
                    <li key={i}>• {req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}