import React, { useState, useEffect, useRef } from 'react';
import { Customer } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutFormProps {
  onSubmit: (customer: Customer) => void;
  loading: boolean;
  initialData?: Customer | null;
  path: string
  onCustomerSelect?: (stripeCustomerId: string | null) => void;
}

interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  metadata?: {
    companyName?: string;
    nip?: string;
  };
}

export default function CheckoutForm({ onSubmit, loading, initialData, onCustomerSelect, path  }: CheckoutFormProps) {
  const { isAdmin } = useAuth();
  const [stripeCustomers, setStripeCustomers] = useState<StripeCustomer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isCompanyDataLocked, setIsCompanyDataLocked] = useState(false);

  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const customerDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  
  const [formData, setFormData] = useState<Customer>({
    email: '',
    companyName: '',
    nip: '',
    contactPerson: {
      firstName: '',
      lastName: '',
      phone: '',
      position: '',
    },
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'PL',
    },
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStripeCustomers();
    }
  }, [isAdmin]);
  
  useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (!customerDropdownRef.current?.contains(e.target as Node)) {
      setCustomerDropdownOpen(false);
      setCustomerSearch("");
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

  const fetchStripeCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetch('/api/stripe/customers');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Customers list:', data);
        setStripeCustomers(data.customers || []);
      } else {
        console.error('Failed to fetch customers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching Stripe customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    
    if (onCustomerSelect) {
      onCustomerSelect(customerId || null);
    }

    if (!customerId) {
      setIsCompanyDataLocked(false);
      setFormData({
        email: '',
        companyName: '',
        nip: '',
        contactPerson: {
          firstName: '',
          lastName: '',
          phone: '',
          position: '',
        },
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: 'PL',
        },
      });
      return;
    }

    try {
      const response = await fetch(`/api/stripe/customers/${customerId}`);
      
      if (response.ok) {
        const data = await response.json();
        const customer = data.customer;
        
        console.log('Customer details from Stripe:', customer);
        
        setFormData({
          email: customer.email || '',
          companyName: customer.metadata?.companyName || customer.name || '',
          nip: customer.nip || '',
          contactPerson: {
            firstName: customer.metadata?.firstName || '',
            lastName: customer.metadata?.lastName || '',
            phone: customer.phone || customer.metadata?.phone || '',
            position: customer.metadata?.position || '',
          },
          address: {
            street: customer.address?.line1 || '',
            city: customer.address?.city || '',
            postalCode: customer.address?.postal_code || '',
            country: customer.address?.country || 'PL',
          },
        });
        setIsCompanyDataLocked(true);
      } else {
        console.error('Failed to fetch customer:', response.status);
        alert('Nie udało się pobrać danych klienta');
        setIsCompanyDataLocked(false);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      alert('Błąd podczas pobierania danych klienta');
      setIsCompanyDataLocked(false);
    }
  };

  useEffect(() => {
    const handleAutofill = (event: Event) => {
      const customEvent = event as CustomEvent<Customer>;
      if (customEvent.detail) {
        setFormData(customEvent.detail);
      }
    };

    window.addEventListener('autofillCustomerData', handleAutofill);
    
    return () => {
      window.removeEventListener('autofillCustomerData', handleAutofill);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Customer] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  const lockedInputClass = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-sm text-slate-400 cursor-not-allowed select-none transition-all";
  const normalInputClass = "w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all";

  return (
        <form onSubmit={handleSubmit} className="space-y-5">
  {isAdmin && path.includes("admincheckout") && (
    <div className="border border-blue-100 rounded-2xl p-6 shadow-sm bg-blue-50/30">
      <h3 className="text-xs font-bold mb-4 text-blue-400 uppercase tracking-widest">
        Panel Administratora
      </h3>
      <div className="relative" ref={customerDropdownRef}>
        <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">
          Wybierz klienta ze Stripe
        </label>

        <div
          onClick={() => {
            setCustomerDropdownOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 border rounded-xl bg-white text-sm transition-all cursor-text ${
            customerDropdownOpen
              ? "border-blue-300 ring-2 ring-blue-50"
              : "border-stone-200 hover:border-blue-200"
          }`}
        >
          {customerDropdownOpen ? (
            <input
              ref={searchInputRef}
              type="text"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Szukaj po nazwie lub email..."
              className="flex-1 bg-transparent text-stone-700 placeholder-stone-300 text-sm focus:outline-none"
            />
          ) : (
            <span className={`flex-1 truncate text-sm ${selectedCustomerId ? "text-stone-700" : "text-stone-300"}`}>
              {loadingCustomers
                ? "Ładowanie klientów..."
                : selectedCustomerId
                ? stripeCustomers.find((c) => c.id === selectedCustomerId)?.name ||
                  stripeCustomers.find((c) => c.id === selectedCustomerId)?.email ||
                  "Wybierz klienta"
                : "Wybierz klienta lub wypełnij ręcznie"}
            </span>
          )}

          <svg
            className={`w-3.5 h-3.5 text-blue-200 transition-transform duration-200 shrink-0 ml-2 ${customerDropdownOpen ? "rotate-180" : ""}`}
            viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {customerDropdownOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white border border-stone-200 rounded-xl shadow-lg shadow-blue-50/80 overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {stripeCustomers
                .filter((c) => {
                  const q = customerSearch.toLowerCase();
                  return (
                    (c.name || "").toLowerCase().includes(q) ||
                    (c.email || "").toLowerCase().includes(q)
                  );
                })
                .map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      handleCustomerSelect(customer.id);
                      setCustomerDropdownOpen(false);
                      setCustomerSearch("");
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex flex-col gap-0.5 border-l-2 ${
                      selectedCustomerId === customer.id
                        ? "bg-blue-50/60 border-l-blue-300 text-stone-800"
                        : "border-l-transparent text-stone-500 hover:bg-blue-50/40 hover:text-stone-700"
                    }`}
                  >
                    <span className="font-medium text-[13px]">{customer.name || customer.email}</span>
                    {customer.name && (
                      <span className="text-[11px] text-stone-400">{customer.email}</span>
                    )}
                  </button>
                ))}
              {stripeCustomers.filter((c) => {
                const q = customerSearch.toLowerCase();
                return (c.name || "").toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
              }).length === 0 && (
                <p className="text-xs text-stone-300 text-center py-4">Brak wyników</p>
              )}
            </div>
          </div>
        )}
      </div>

      {loadingCustomers && (
        <p className="text-[11px] text-blue-300 mt-1.5">Ładowanie klientów...</p>
      )}
    </div>
  )}
      <div className={`border rounded-2xl p-6 shadow-sm transition-colors ${isCompanyDataLocked ? 'bg-slate-50 border-slate-200' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest">Dane firmy</h3>
          {isCompanyDataLocked && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Dane z Stripe
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Nazwa firmy *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">NIP *</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold mb-5 text-stone-800 uppercase tracking-widest">Osoba kontaktowa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Imię *</label>
            <input
              type="text"
              name="contactPerson.firstName"
              value={formData.contactPerson.firstName}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
              
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Nazwisko *</label>
            <input
              type="text"
              name="contactPerson.lastName"
              value={formData.contactPerson.lastName}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Telefon *</label>
            <input
              type="tel"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Stanowisko</label>
            <input
              type="text"
              name="contactPerson.position"
              value={formData.contactPerson.position}
              onChange={handleChange}
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold mb-5 text-stone-800 uppercase tracking-widest">Adres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Ulica i numer *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Miasto *</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Kod pocztowy *</label>
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              required
              pattern="[0-9]{2}-[0-9]{3}"
              placeholder="00-000"
              disabled={isCompanyDataLocked}
              className={isCompanyDataLocked ? lockedInputClass : normalInputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3.5 rounded-2xl hover:bg-blue-800 active:scale-[0.99] transition-all font-semibold text-sm tracking-wide shadow-md hover:shadow-lg disabled:bg-stone-300 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? 'Przetwarzanie...' : 'Przejdź do płatności →'}
      </button>
    </form>
  );
}