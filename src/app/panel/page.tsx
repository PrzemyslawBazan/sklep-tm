'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, Mail, Calendar, Package, Clock, ChevronRight, X, Building2, MapPin } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';
import { upsertUserProfile } from '../api/user/userApi'; // Import your update function
import { UpdateUserProfileData } from "../api/user/userApi";

export default function Panel() {
    const { user } = useAuth();
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const { data, isLoading, hasError } = useUserData();

    const { userProfile, currentServices, purchaseHistory } = data;
    
    console.log(data)

    const [formData, setFormData] = useState<UpdateUserProfileData>({
        company_name: '',
        nip: '',
        regon: '',
        krs: '',
        contact_first_name: '',
        contact_last_name: '',
        contact_phone: '',
        contact_position: '',
        address: {
            street: '',
            city: '',
            postal_code: '',
            country: 'Polska'
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const showMenu = () => {
        router.push("/");
    }

    const handleSubmit = async () => {
        setIsSaving(true);
        
        try {
            const result = await upsertUserProfile(user, formData);
            
            if (result.success) {
                setIsEditModalOpen(false);
                
                window.location.reload();
            } else {
                alert(`Błąd: ${result.error || 'Nie udało się zapisać danych'}`);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Wystąpił nieoczekiwany błąd podczas zapisywania');
        } finally {
            setIsSaving(false);
        }
    };

    const getServiceStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Aktywne';
            case 'pending': return 'Oczekujące';
            case 'completed': return 'Zakończone';
            case 'cancelled': return 'Anulowane';
            default: return status;
        }
    };

    const editProfile = () => {
        // Pre-fill form with existing data if available
        setFormData({
            company_name: userProfile?.company || '',
            nip: userProfile?.nip || '',
            regon: userProfile?.regon || '',
            krs: userProfile?.krs || '',
            contact_first_name: userProfile?.contact_first_name || '',
            contact_last_name: userProfile?.contact_last_name || '',
            contact_phone: userProfile?.phone || '',
            contact_position: userProfile?.contact_position || '',
            address: {
                street: userProfile?.address?.street || '',
                city: userProfile?.address?.city || '',
                postal_code: userProfile?.address?.postal_code || '',
                country: userProfile?.address?.country || 'Polska'
            }
        });
        setIsEditModalOpen(true);
    }

    if (!user) {
        return (
            <div className="min-h-screen  flex items-center justify-center bg-custom-beige">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Dostęp zabroniony</h2>
                    <p className="text-gray-600 mb-6">Musisz być zalogowany, aby zobaczyć ten panel.</p>
                    <button 
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Zaloguj się
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="min-h-screen bg-custom-beige flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Błąd ładowania danych</h2>
                    <p className="text-gray-600 mb-6">Wystąpił problem podczas pobierania danych.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-custom-beige py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Panel użytkownika</h1>
                        <p className="text-gray-600 mt-2">Zarządzaj swoim kontem i usługami</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* User Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {userProfile?.displayName || 'Użytkownik'}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {userProfile?.company || 'Tax&Money sp z o. o.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{userProfile?.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{userProfile?.phone}</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                                            <div>
                                                <p className="text-sm font-medium text-emerald-800">Status subskrypcji</p>
                                                <p className="text-xs text-emerald-600">Aktywna do 31.12.2024</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full shadow-sm">
                                            Subscribed
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors" onClick={editProfile}>
                                    Edytuj profil
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Aktualnie realizowane</h3>
                                    <Package className="w-5 h-5 text-gray-400" />
                                </div>

                                {currentServices.length > 0 ? (
                                    <div className="space-y-4">
                                        {currentServices.map((service) => (
                                            <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            <span>Od: {service.startDate.toLocaleDateString('pl-PL')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceStatusColor(service.status)}`}>
                                                            {getStatusText(service.status)}
                                                        </span>
                                                        <span className="font-bold text-gray-900">{service.price} zł</span>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">Brak aktywnych usług</p>
                                        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={showMenu}>
                                            Przeglądaj ofertę
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Historia zakupów</h3>
                                    <Clock className="w-5 h-5 text-gray-400" />
                                </div>

                                {purchaseHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {purchaseHistory.map((purchase) => (
                                            <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 mb-1">{purchase.serviceName}</h4>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            <span>{purchase.date.toLocaleDateString('pl-PL')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceStatusColor(purchase.status)}`}>
                                                            {getStatusText(purchase.status)}
                                                        </span>
                                                        <span className="font-bold text-gray-900">{purchase.amount} zł</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                            Zobacz wszystkie zakupy
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">Brak historii zakupów</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <h2 className="text-2xl font-bold text-gray-900">Edytuj profil firmy</h2>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Company Information Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Dane firmy</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nazwa firmy *
                                        </label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="np. Tax&Money sp. z o.o."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIP *
                                        </label>
                                        <input
                                            type="text"
                                            name="nip"
                                            value={formData.nip}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="0000000000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            REGON
                                        </label>
                                        <input
                                            type="text"
                                            name="regon"
                                            value={formData.regon}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="000000000"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            KRS
                                        </label>
                                        <input
                                            type="text"
                                            name="krs"
                                            value={formData.krs}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="0000000000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Adres siedziby</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ulica i numer *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={formData.address.street}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="ul. Przykładowa 123/45"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Miasto *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Warszawa"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kod pocztowy *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.postal_code"
                                            value={formData.address.postal_code}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="00-000"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kraj *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={formData.address.country}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Polska"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Person Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <User className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Osoba kontaktowa</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Imię *
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_first_name"
                                            value={formData.contact_first_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Jan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nazwisko *
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_last_name"
                                            value={formData.contact_last_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Kowalski"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon *
                                        </label>
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            value={formData.contact_phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="+48 123 456 789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stanowisko *
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_position"
                                            value={formData.contact_position}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="np. Prezes, Dyrektor"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Zapisywanie...
                                        </>
                                    ) : (
                                        'Zapisz zmiany'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}