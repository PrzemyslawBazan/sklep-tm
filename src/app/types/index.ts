// types/index.ts
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  category: string;
  price: number;
  currency: string;
  vatRate: number;
  priceIncludesVat: boolean;
  isActive: boolean;
  deliverables: string[]; // Array of strings
  overview: string;
  overview_points: string[],
  steps: string[],
  requirements: string[],
  ud_code: number | null,
  start_time: string | number | null,
  finish_time: string | number | null
}
export interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  addedAt: Date;
  note?: string
}

export interface CreateServiceData {
  name: string;
  slug: string;
  description: string;
  full_description: string;
  category: string;
  price: number | null;
  currency: string;
  vat_rate: number | null;
  price_includes_vat: boolean;  
  is_active: boolean;
  deliverables: string[];
  overview: string;
  overview_points: string[],
  steps: string[],
  requirements: string[],
  ud_code: number | null,
  start_time: string | number | null
  finish_time: string | number | null
}


export interface Customer {
  email: string;
  companyName: string;
  nip: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    phone: string;
    position?: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customer: {
    email: string;
    companyName: string;
    nip: string;
    contactPerson: string;
    phone: string;
  };
  service: {
    serviceId: string;
    name: string;
    description: string;
    price: number;
    vatRate: number;
  };
  pricing: {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    currency: string;
  };
  payment: {
    status: 'pending' | 'paid' | 'failed';
    stripeCustomerId?: string;
    stripePaymentIntentId?: string;
  };
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export type AddToCartState = "idle" | "adding" | "success";


export interface UseAddToCartAnimationOptions {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  addingDuration?: number;
  successDuration?: number;
}

export interface UseAddToCartAnimationReturn {
  state: AddToCartState;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled: boolean;
}

export interface AddToCartButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
  className?: string;
  idleText?: string;
  successText?: string;
}

export { AddToCartButton } from "../components/Buttons/CartButton/AddToCartButton";
export { CartIcon, BoxIcon, CheckIcon } from "../components/Buttons/CartButton/icons";
export { useAddToCartAnimation } from "../components/Buttons/CartButton/AddToCartAnimation";
