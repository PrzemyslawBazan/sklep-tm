import ServiceCard from '@/app/components/ServiceCard';
import { Service, CreateServiceData
 } from '../../types/index';
import supabase from '@/app/lib/supabase';

export const fetchActiveServices = async (): Promise<Service[]> => {
  try {
    
    const { data: allServices, error: allError, count } = await supabase
      .from('services')
      .select('*', { count: 'exact' });

    console.log('📊 Total services in database:', count);
    console.log('📋 All services:', allServices);

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name'); 
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch services: ${error.message}`);
    }

    const servicesData: Service[] = data?.map(service => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        fullDescription: service.full_description, 
        category: service.category,
        price: service.price,
        currency: service.currency,
        vatRate: service.vat_rate, 
        priceIncludesVat: service.price_includes_vat, 
        isActive: service.is_active, 
        deliverables: service.deliverables,
        overview: service.overview,
        overview_points: service.overview_points,
        steps: service.steps,
        requirements: service.requirements,
      })) || [];


    return servicesData;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
};

export const createService = async (serviceData: {
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
  requirements: string[]
}, isAdmin: boolean): Promise<{ success: boolean; data?: Service; error?: string }> => {
  try {
    if (!isAdmin) {
      throw new Error("Not an admin");
    }
    const dataToInsert: CreateServiceData = {
      name: serviceData.name,
      slug: serviceData.slug,
      description: serviceData.description,
      full_description: serviceData.full_description,
      category: serviceData.category,
      price: serviceData.price ? parseFloat(serviceData.price) : null,
      currency: serviceData.currency,
      vat_rate: serviceData.vat_rate 
    ? parseFloat(serviceData.vat_rate) / 100 
    : null,
      price_includes_vat: serviceData.price_includes, 
      is_active: serviceData.is_active,
      deliverables: serviceData.deliverables,
      overview: serviceData.overview,
      overview_points: serviceData.overview_points,
      steps: serviceData.steps,
      requirements: serviceData.requirements
    };


    const { data, error } = await supabase
      .from('services')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error creating service:', error);
      throw new Error(error.message);
    }

    console.log('✅ Service created successfully:', data);
    const createdService: Service = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      fullDescription: data.full_description,
      category: data.category,
      price: data.price,
      currency: data.currency,
      vatRate: data.vat_rate,
      priceIncludesVat: data.price_includes_vat,
      isActive: data.is_active,
      deliverables: data.deliverables,
      overview: data.overview,
      overview_points: data.overview_points,
      steps: data.steps,
      requirements: data.requirements
    };

    return { success: true, data: createdService };
  } catch (error) {
    console.error('❌ Error creating service:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
