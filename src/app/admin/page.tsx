'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ServiceForm from '../components/admin/ServiceForm';
import supabase from '../lib/supabase'
import SuccessMessage from '../components/admin/SuccessMessage';
import { 
    LayoutDashboard, 
    Plus, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    Package, 
    CheckCircle, 
    TrendingUp,
    Loader2,
    Lock
} from 'lucide-react';

type AdminView = 'add' | 'update' | 'delete' | 'overview';

export default function AdminPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<AdminView>('overview');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [numberOfActiveServices, setNumberOfActiveServices] = useState<number>(0);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/404');
            } else {
                getNumberOfTotalServices();
            }
        }
    }, [user, isAdmin, loading, router]);

    const handleServiceCreated = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const getNumberOfTotalServices = async () => {
       const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
         if (error) {
            console.error('Error fetching service count:', error);
            return;
        }
        setNumberOfActiveServices(count || 0);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <div className="text-sm text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-lg text-gray-600">Unauthorized access</div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: 'overview' as AdminView, label: 'Przegląd', icon: LayoutDashboard },
        { id: 'add' as AdminView, label: 'Add Product', icon: Plus },
        { id: 'update' as AdminView, label: 'Update Product', icon: Edit },
        { id: 'delete' as AdminView, label: 'Delete Product', icon: Trash2 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    activeView === item.id
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                {sidebarOpen && <span className="text-sm">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-200">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    Admin
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    <SuccessMessage show={showSuccess} />

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {menuItems.find(item => item.id === activeView)?.label}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {activeView === 'overview' && 'Zarządzaj usługami i przeglądaj analizy'}
                            {activeView === 'add' && 'Add a new product to your catalog'}
                            {activeView === 'update' && 'Update existing product information'}
                            {activeView === 'delete' && 'Remove products from your catalog'}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {activeView === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-blue-50 rounded-lg">
                                        <Package className="w-8 h-8 text-blue-600 mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-sm text-gray-600">Pełna liczba usług</div>
                                    </div>
                                    <div className="p-6 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">{numberOfActiveServices}</div>
                                        <div className="text-sm text-gray-600">Aktywne usługi</div>
                                    </div>
                                    <div className="p-6 bg-purple-50 rounded-lg">
                                        <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-sm text-gray-600">Ostatnie aktualizacje</div>
                                    </div>
                                </div>
                                <div className="pt-6 text-center text-gray-500">
                                    <p>Wybierz metodę z panelu bocznego aby rozpocząć.</p>
                                </div>
                            </div>
                        )}

                        {activeView === 'add' && (
                            <ServiceForm 
                                onServiceCreated={handleServiceCreated} 
                                isAdmin={isAdmin} 
                            />
                        )}

                        {activeView === 'update' && (
                            <div className="text-center py-12 text-gray-500">
                                <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg">Zaktualizuj usługę</p>
                                <p className="text-sm mt-2">Add your update product component here</p>
                            </div>
                        )}

                        {activeView === 'delete' && (
                            <div className="text-center py-12 text-gray-500">
                                <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg">Usuń usługę</p>
                                <p className="text-sm mt-2">Add your delete product component here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}