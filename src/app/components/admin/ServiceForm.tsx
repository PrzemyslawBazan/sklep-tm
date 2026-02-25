import { useState } from 'react';
import { Plus, Save, Sparkles } from 'lucide-react';
import FormHeader from './FormHeader';
import BasicInfoFields from './BasicInfoFields';
import DescriptionFields from './DescriptionFields';
import CategoryPricingFields from './CategoryPricingFields';
import VatOptionsFields from './VatOptionsFields';
import DeliverablesField from './DeliverablesField';
import OverviewFields from './OverviewFields';
import StepsField from './StepsField';
import RequirementsField from './RequirementsField';
import SubmitButton from './SubmitButton';
import { createService } from '@/app/api/services/servicesApi';
import supabase from '@/app/lib/supabase';
import { useEffect } from 'react';

import DurationField from './DurationField';

export interface ServiceData {
    name: string;
    slug: string;
    description: string;
    full_description: string;
    category: string;
    price: string;
    currency: string;
    vat_rate: string;
    price_includes: boolean;
    is_active: boolean;
    deliverables: string[];
    overview: string;
    overview_points: string[];
    steps: string[];
    requirements: string[];
    ud_code: string | number | null;
    start_time: string | null;
    finish_time: string | null;
}

interface ServiceFormProps {
    onServiceCreated: () => void;
    isAdmin: boolean
}

export default function ServiceForm({ onServiceCreated, isAdmin }: ServiceFormProps) {
    const [formData, setFormData] = useState<ServiceData>({
        name: '',
        slug: '',
        description: '',
        full_description: '',
        category: '',
        price: '',
        currency: 'USD',
        vat_rate: '',
        price_includes: false,
        is_active: true,
        deliverables: [],
        overview: '',
        overview_points: [],
        steps: [],
        requirements: [],
        ud_code: '',
        start_time: '',
        finish_time: ''
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [udCodes, setUdCodes] = useState<{ id: number; name: string }[]>([]);
    useEffect(() => {
        const fetchUdCodes = async () => {
            const { data } = await supabase.from('ud_codes').select('*');
            if (data) setUdCodes(data);
        };
        fetchUdCodes();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleUdCodeAdded = (code: { id: number; name: string }) => {
    setUdCodes(prev => [...prev, code]);
    };

    
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleDeliverablesChange = (deliverables: string[]) => {
        setFormData(prev => ({
            ...prev,
            deliverables
        }));
    };

    const handleOverviewPointsChange = (overviewPoints: string[]) => {
        setFormData(prev => ({
            ...prev,
            overview_points: overviewPoints
        }));
    };

    const handleStepsChange = (steps: string[]) => {
        setFormData(prev => ({
            ...prev,
            steps
        }));
    };

    const handleRequirementsChange = (requirements: string[]) => {
        setFormData(prev => ({
            ...prev,
            requirements
        }));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Service name is required');
            return false;
        }
        if (!formData.slug.trim()) {
            setError('URL slug is required');
            return false;
        }
        if (formData.price && isNaN(parseFloat(formData.price))) {
            setError('Price must be a valid number');
            return false;
        }
        if (formData.vat_rate && isNaN(parseFloat(formData.vat_rate))) {
            setError('VAT rate must be a valid number');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError('');
        
        try {
            // make sure to check that the user is admin before calling it. that's for later.
            const result = await createService({
                ...formData,
                ud_code: formData.ud_code ? Number(formData.ud_code) : null
            }, isAdmin);            
            console.log("ERROR")
            console.log(result.data);
            if (result.success) {
                onServiceCreated();
                
                // Reset form
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    full_description: '',
                    category: '',
                    price: '',
                    currency: 'USD',
                    vat_rate: '',
                    price_includes: false,
                    is_active: true,
                    deliverables: [],
                    overview: '',
                    overview_points: [],
                    steps: [],
                    requirements: [],
                    ud_code: '',
                    start_time: '',
                    finish_time: ''
                });
            } else {
                setError(result.error || 'Failed to create service');
            }
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Error creating service:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="">
            <FormHeader />
            
            <div className="p-6 space-y-6">
                <BasicInfoFields 
                    formData={formData}
                    onNameChange={handleNameChange}
                    onInputChange={handleInputChange}
                />
                
                <DescriptionFields 
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                
                <CategoryPricingFields 
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                
                <VatOptionsFields 
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                
                <DeliverablesField 
                    formData={formData}
                    onDeliverablesChange={handleDeliverablesChange}
                />

               <OverviewFields
                    formData={formData}
                    onInputChange={handleInputChange}
                    onOverviewPointsChange={handleOverviewPointsChange}
                    udCodes={udCodes}
                    onUdCodeAdded={handleUdCodeAdded}
                />

                <StepsField 
                    formData={formData}
                    onStepsChange={handleStepsChange}
                />

                <RequirementsField 
                    formData={formData}
                    onRequirementsChange={handleRequirementsChange}
                />
                <DurationField
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                
                <SubmitButton 
                    isSubmitting={isSubmitting}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}