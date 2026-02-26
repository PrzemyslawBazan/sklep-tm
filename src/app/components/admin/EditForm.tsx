import { useState, useEffect } from 'react';
import BasicInfoFields from './BasicInfoFields';
import DescriptionFields from './DescriptionFields';
import CategoryPricingFields from './CategoryPricingFields';
import VatOptionsFields from './VatOptionsFields';
import DeliverablesField from './DeliverablesField';
import OverviewFields from './OverviewFields';
import StepsField from './StepsField';
import RequirementsField from './RequirementsField';
import SubmitButton from './SubmitButton';
import DurationField from './DurationField';
import { ServiceData } from './ServiceForm';
import { updateService } from '@/app/api/services/servicesApi';
import supabase from '@/app/lib/supabase';

interface EditFormProps {
    onServiceUpdated: () => void;
    isAdmin: boolean;
}

export default function EditForm({ onServiceUpdated, isAdmin }: EditFormProps) {
    const [services, setServices] = useState<{ id: string; name: string }[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ServiceData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [udCodes, setUdCodes] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
         const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('id, name');
        if (data) setServices(data);
        if (error) console.error(error);
    };
    fetchServices();
    }, []);

    useEffect(() => {
        const fetchUdCodes = async () => {
            const { data } = await supabase.from('ud_codes').select('*');
            if (data) setUdCodes(data);
        };
        fetchUdCodes();
    }, []);

    useEffect(() => {
    if (!selectedServiceId) return;

    const fetchService = async () => {
        setIsLoading(true);
        setError('');
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', selectedServiceId)
            .single();
        console.log('Raw data from supabase:', data);
        console.log('Error from supabase:', error);

        if (data) {
            
            setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description ?? '',
                full_description: data.full_description ?? '',
                category: data.category ?? '',
                price: data.price != null ? String(data.price) : '',
                currency: data.currency ?? 'USD',
                vat_rate: data.vat_rate != null ? String(parseFloat(data.vat_rate) * 100) : '',
                price_includes: data.price_includes_vat ?? false,
                is_active: data.is_active ?? true,
                deliverables: data.deliverables ?? [],
                overview: data.overview ?? '',
                overview_points: data.overview_points ?? [],
                steps: data.steps ?? [],
                requirements: data.requirements ?? [],
                ud_code: data.ud_code ?? null,
                start_time: data.start_time ?? '',
                finish_time: data.finish_time ?? ''
            });
        }
        if (error) setError('Failed to load service');
        setIsLoading(false);
    };
    fetchService();
}, [selectedServiceId]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => prev ? ({ ...prev, [name]: type === 'checkbox' ? checked : value }) : null);
    };

    const generateSlug = (name: string) =>
        name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => prev ? ({ ...prev, name, slug: generateSlug(name) }) : null);
    };

    const handleUdCodeAdded = (code: { id: number; name: string }) =>
        setUdCodes(prev => [...prev, code]);
    // change the design
    const handleSubmit = async () => {
        if (!formData || !selectedServiceId) return;
        setIsSubmitting(true);
        setError('');
        try {
            const result = await updateService(selectedServiceId, {
                ...formData,
                ud_code: formData.ud_code ? Number(formData.ud_code) : null
            }, isAdmin);

            if (result.success) {
                onServiceUpdated();
            } else {
                setError(result.error || 'Failed to update service');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* Service selector bar */}
            <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Select Service
                </label>
                <select
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedServiceId ?? ''}
                    onChange={e => { setSelectedServiceId(e.target.value || null)
                    }}
                >
                    <option value="">-- Choose a service to edit --</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Form area */}
            {!selectedServiceId && (
                <p className="p-6 text-gray-400 text-sm">Select a service above to start editing.</p>
            )}

            {selectedServiceId && isLoading && (
                <p className="p-6 text-gray-400 text-sm">Loading service...</p>
            )}

            {selectedServiceId && !isLoading && formData && (
                <div className="p-6 space-y-6">
                    <BasicInfoFields formData={formData} onNameChange={handleNameChange} onInputChange={handleInputChange} />
                    <DescriptionFields formData={formData} onInputChange={handleInputChange} />
                    <CategoryPricingFields formData={formData} onInputChange={handleInputChange} />
                    <VatOptionsFields formData={formData} onInputChange={handleInputChange} />
                    <DeliverablesField formData={formData} onDeliverablesChange={d => setFormData(p => p ? ({ ...p, deliverables: d }) : null)} />
                    <OverviewFields
                        formData={formData}
                        onInputChange={handleInputChange}
                        onOverviewPointsChange={pts => setFormData(p => p ? ({ ...p, overview_points: pts }) : null)}
                        udCodes={udCodes}
                        onUdCodeAdded={handleUdCodeAdded}
                    />
                    <StepsField formData={formData} onStepsChange={s => setFormData(p => p ? ({ ...p, steps: s }) : null)} />
                    <RequirementsField formData={formData} onRequirementsChange={r => setFormData(p => p ? ({ ...p, requirements: r }) : null)} />
                    <DurationField formData={formData} onInputChange={handleInputChange} />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
                </div>
            )}
        </div>
    );
}