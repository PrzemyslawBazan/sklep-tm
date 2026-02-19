import React from 'react';
import { Service } from '../types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ServiceImage from '../utils/img/service.png'
import {AddToCartButton} from '@/app/types/index'
import { useAuth } from '../contexts/AuthContext';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (service: Service, userId?: string) => void;
}

export default function ServiceCard({ service, onAddToCart }: ServiceCardProps) {
  const router = useRouter();
  const { user} = useAuth()
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCardClick = () => {
    router.push(`/services/${service.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    onAddToCart(service, user?.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="relative flex-shrink-0 w-full md:w-[300px] cursor-pointer rounded-2xl bg-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg"
      aria-label={`Zobacz szczegóły usługi ${service.name}`}
    >
      
    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        <Image 
          src={ServiceImage}
          alt={service.description}
          width={280}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 bg-custom-beige">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
          {service.name}
        </h3>
        
        <p className="text-xs text-gray-600 mb-4 line-clamp-2 min-h-[32px]">
          {service.description}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
              {formatPrice(service.price)} zł <span className="text-sm font-normal text-gray-600">+ VAT</span>
            </p>
          </div>
          
          <AddToCartButton
              onClick={handleAddToCart}
            ariaLabel={`Dodaj usługę ${service.name} do koszyka`}
            />
        </div>
      </div>
    </div>
  );
}