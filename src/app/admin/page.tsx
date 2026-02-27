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
    Layers,
    Zap,
    History,
    Loader2,
    Lock
} from 'lucide-react';
import EditForm from '../components/admin/EditForm';

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
    const handleServiceUpdated = () => {
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
            <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-5 h-5 text-[#0078D4] animate-spin" />
                    <p className="text-sm text-[#605E5C]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
                <div className="text-center">
                    <Lock className="w-10 h-10 text-[#A19F9D] mx-auto mb-3" />
                    <p className="text-[#323130]">Unauthorized access</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: 'overview' as AdminView, label: 'Przegląd', icon: LayoutDashboard },
        { id: 'add' as AdminView, label: 'Dodaj usługę', icon: Plus },
        { id: 'update' as AdminView, label: 'Zaktualizuj usługę', icon: Edit },
        { id: 'delete' as AdminView, label: 'Usuń usługę', icon: Trash2 },
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F8] flex font-[system-ui]">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-60' : 'w-14'
                } bg-[#F3F2F1] border-r border-[#EDEBE9] transition-all duration-200 flex flex-col`}
            >
                {/* Header */}
                <div className="h-12 px-4 flex items-center justify-between border-b border-[#EDEBE9]">
                    {sidebarOpen && (
                        <span className="text-sm font-semibold text-[#323130]">Admin Panel</span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-1.5 hover:bg-[#E1DFDD] rounded transition-colors ${!sidebarOpen && 'mx-auto'}`}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="w-4 h-4 text-[#605E5C]" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-[#605E5C]" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-2">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors relative ${
                                    isActive
                                        ? 'bg-[#E1DFDD] text-[#323130]'
                                        : 'text-[#605E5C] hover:bg-[#E1DFDD]'
                                } ${!sidebarOpen && 'justify-center px-0'}`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#0078D4] rounded-r" />
                                )}
                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="text-sm">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="border-t border-[#EDEBE9] p-3">
                    <div className={`flex items-center gap-2.5 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-8 h-8 bg-[#0078D4] rounded-sm flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="min-w-0">
                                <p className="text-sm text-[#323130] truncate">Admin</p>
                                <p className="text-xs text-[#A19F9D] truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto">
                {/* Top bar */}
                <div className="h-12 bg-white border-b border-[#EDEBE9] px-6 flex items-center">
                    <nav className="flex items-center gap-1.5 text-sm">
                        <span className="text-[#0078D4] hover:underline cursor-pointer">Home</span>
                        <ChevronRight className="w-3 h-3 text-[#A19F9D]" />
                        <span className="text-[#323130]">
                            {menuItems.find(item => item.id === activeView)?.label}
                        </span>
                    </nav>
                </div>

                <div className="p-6">
                    <SuccessMessage show={showSuccess} />

                    {/* Page header */}
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-[#323130]">
                            {menuItems.find(item => item.id === activeView)?.label}
                        </h1>
                        <p className="text-sm text-[#605E5C] mt-1">
                            {activeView === 'overview' && 'Zarządzaj usługami i przeglądaj analizy'}
                            {activeView === 'add' && 'Add a new product to your catalog'}
                            {activeView === 'update' && 'Update existing product information'}
                            {activeView === 'delete' && 'Remove products from your catalog'}
                        </p>
                    </div>

                    {/* Content */}
                    {activeView === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats - Azure tile layout */}
                            <div className="grid grid-cols-3 gap-px bg-[#EDEBE9]">
                                <div className="bg-white p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-[#605E5C] uppercase tracking-wide">Pełna liczba usług</p>
                                            <p className="text-3xl font-light text-[#323130] mt-2">0</p>
                                        </div>
                                        <Layers className="w-5 h-5 text-[#0078D4]" />
                                    </div>
                                </div>
                                <div className="bg-white p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-[#605E5C] uppercase tracking-wide">Aktywne usługi</p>
                                            <p className="text-3xl font-light text-[#323130] mt-2">{numberOfActiveServices}</p>
                                        </div>
                                        <Zap className="w-5 h-5 text-[#107C10]" />
                                    </div>
                                </div>
                                <div className="bg-white p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-[#605E5C] uppercase tracking-wide">Ostatnie aktualizacje</p>
                                            <p className="text-3xl font-light text-[#323130] mt-2">0</p>
                                        </div>
                                        <History className="w-5 h-5 text-[#5C2D91]" />
                                    </div>
                                </div>
                            </div>

                            {/* Empty state */}
                            <div className="bg-white border border-[#EDEBE9] p-8">
                                <div className="text-center">
                                    <p className="text-sm text-[#605E5C]">Wybierz metodę z panelu bocznego aby rozpocząć.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'add' && (
                        <div className="bg-white border border-[#EDEBE9] p-6">
                            <ServiceForm 
                                onServiceCreated={handleServiceCreated} 
                                isAdmin={isAdmin} 
                            />
                        </div>
                    )}

                    {activeView === 'update' && (
                        <div className="bg-white border border-[#EDEBE9] p-8">
                            <div className="text-center py-8">
                                <Edit className="w-10 h-10 text-[#A19F9D] mx-auto mb-3" />
                                <p className="text-[#323130] font-medium">Zaktualizuj usługę</p>
                                <EditForm onServiceUpdated={handleServiceUpdated} isAdmin={isAdmin} />
                            </div>
                        </div>
                    )}

                    {activeView === 'delete' && (
                        <div className="bg-white border border-[#EDEBE9] p-8">
                            <div className="text-center py-8">
                                <Trash2 className="w-10 h-10 text-[#A19F9D] mx-auto mb-3" />
                                <p className="text-[#323130] font-medium">Usuń usługę</p>
                                <p className="text-sm text-[#605E5C] mt-1">Add your delete product component here</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}