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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
  className="relative flex-shrink-0 w-full md:w-[300px] cursor-pointer overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
  aria-label={`Zobacz szczegóły usługi ${service.name}`}
>
  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100">
    <Image
      src={ServiceImage}
      alt={service.description}
      width={280}
      height={192}
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
    />

    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
  </div>

  <div className="bg-custom-beige p-4">
    <h3 className="min-h-[48px] line-clamp-2 text-base font-semibold leading-6 text-slate-900">
      {service.name}
    </h3>

    <p className="mt-2 min-h-[40px] line-clamp-2 text-sm leading-5 text-slate-600">
      {service.description}
    </p>

    <div className="mt-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-2xl font-semibold tracking-tight text-slate-900 whitespace-nowrap">
          {formatPrice(service.price)} zł
        </p>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          + VAT
        </p>
      </div>

      <div className="shrink-0">
        <AddToCartButton
          onClick={handleAddToCart}
          ariaLabel={`Dodaj usługę ${service.name} do koszyka`}
        />
      </div>
    </div>
  </div>
</div>
  );
}