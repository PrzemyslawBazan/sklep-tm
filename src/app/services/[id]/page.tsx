'use client';

import { useParams, useRouter } from 'next/navigation';
import { useServices } from '../../hooks/useServices';
import { useAddToCart, useTotalItems } from '../../contexts/CartContext';

import Image from 'next/image';
import serviceImage from '../../utils/img/service.png';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: services = [], isLoading, isError } = useServices();
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
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={goToCart}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
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
                  <span className="ml-2">od 1 do 3 dni</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(service)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                Dodaj do koszyka
              </button>

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