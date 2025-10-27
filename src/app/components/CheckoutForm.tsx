import React, { useState, useEffect } from 'react';
import { Customer } from '../types';

interface CheckoutFormProps {
  onSubmit: (customer: Customer) => void;
  loading: boolean;
  initialData?: Customer | null;
}

export default function CheckoutForm({ onSubmit, loading, initialData }: CheckoutFormProps) {
  const [formData, setFormData] = useState<Customer>({
    email: '',
    companyName: '',
    nip: '',
    regon: '',
    krs: '',
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

  // Listen for autofill event from parent component
  useEffect(() => {
    const handleAutofill = (event: Event) => {
      const customEvent = event as CustomEvent<Customer>;
      if (customEvent.detail) {
        setFormData(customEvent.detail);
      }
      console.log(formData);
    };

    window.addEventListener('autofillCustomerData', handleAutofill);
    
    return () => {
      window.removeEventListener('autofillCustomerData', handleAutofill);
    };
  }, []);

  // Auto-fill on mount if initialData is provided
  useEffect(() => {
    if (initialData) {
      console.log(initialData);
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-custom-beige space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Dane firmy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nazwa firmy *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NIP *</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">REGON</label>
            <input
              type="text"
              name="regon"
              value={formData.regon}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">KRS</label>
            <input
              type="text"
              name="krs"
              value={formData.krs}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Osoba kontaktowa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Imię *</label>
            <input
              type="text"
              name="contactPerson.firstName"
              value={formData.contactPerson.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nazwisko *</label>
            <input
              type="text"
              name="contactPerson.lastName"
              value={formData.contactPerson.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon *</label>
            <input
              type="tel"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stanowisko</label>
            <input
              type="text"
              name="contactPerson.position"
              value={formData.contactPerson.position}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Adres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Ulica i numer *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Miasto *</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kod pocztowy *</label>
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              required
              pattern="[0-9]{2}-[0-9]{3}"
              placeholder="00-000"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
      >
        {loading ? 'Przetwarzanie...' : 'Przejdź do płatności'}
      </button>
    </form>
  );
}