import { User } from '@supabase/supabase-js';
import supabase
 from '@/app/lib/supabase';
export interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  company: string;
  createdAt: Date;
  nip?: string;
  regon?: string;
  krs?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_position?: string;
  address?: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export interface Service {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  startDate: Date;
  endDate?: Date;
  price: number;
}

export interface PurchaseHistory {
  id: string;
  serviceName: string;
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface UpdateUserProfileData {
  company_name: string;
  nip: string;
  regon?: string;
  krs?: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_phone: string;
  contact_position: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
}


export const upsertUserProfile = async (
  user: User | null,
  profileData: UpdateUserProfileData
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (user === null) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('id, address_id')
      .eq('user_id', user.id)
      .eq('email', user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing customer:', fetchError);
      return { success: false, error: 'Failed to check existing data' };
    }

    let addressId = existingCustomer?.address_id;

    if (addressId) {
      const { error: addressUpdateError } = await supabase
        .from('addresses')
        .update({
          street: profileData.address.street,
          city: profileData.address.city,
          postal_code: profileData.address.postal_code,
          country: profileData.address.country,
          updated_at: new Date().toISOString()
        })
        .eq('id', addressId);

      if (addressUpdateError) {
        console.error('Error updating address:', addressUpdateError);
        return { success: false, error: 'Failed to update address' };
      }
    } else {
      const { data: newAddress, error: addressCreateError } = await supabase
        .from('addresses')
        .insert({
          street: profileData.address.street,
          city: profileData.address.city,
          postal_code: profileData.address.postal_code,
          country: profileData.address.country
        })
        .select('id')
        .single();

      if (addressCreateError || !newAddress) {
        console.error('Error creating address:', addressCreateError);
        return { success: false, error: 'Failed to create address' };
      }

      addressId = newAddress.id;
    }

    const customerData = {
      user_id: user.id,
      email: user.email,
      company_name: profileData.company_name,
      nip: profileData.nip,
      regon: profileData.regon || null,
      krs: profileData.krs || null,
      contact_first_name: profileData.contact_first_name,
      contact_last_name: profileData.contact_last_name,
      contact_phone: profileData.contact_phone,
      contact_position: profileData.contact_position,
      address_id: addressId,
      updated_at: new Date().toISOString()
    };

    if (existingCustomer) {
      const { error: updateError } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', existingCustomer.id);

      if (updateError) {
        console.error('Error updating customer:', updateError);
        return { success: false, error: 'Failed to update profile' };
      }
    } else {
      // Create new customer
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          ...customerData,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating customer:', insertError);
        return { success: false, error: 'Failed to create profile' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};


export const fetchUserProfile = async (user: User | null): Promise<UserProfile | null> => {
  try {
    if (user === null) {
      return null;
    }

    const { data: customerData, error } = await supabase
      .from('customers')
      .select(`
        *,
        addresses (
          street,
          city,
          postal_code,
          country
        )
      `)
      .eq('user_id', user.id)
      .eq('email', user.email)
      .limit(1);
      
    console.log(`XDDDDD ${user.id}`)
    
    if (error && error.code !== 'PGRST116') { 
      console.error('Error fetching customer data:', error);
    }
    
    if (customerData && customerData.length > 0) {
      const customer = customerData[0];
      return {
        displayName: `${customer.contact_first_name || "Test"} ${customer.contact_last_name || "Name"}` || user.user_metadata?.full_name || "Użytkownik",
        email: user.email || "",
        phone: customer.contact_phone || "",
        company: customer.company_name || "",
        createdAt: new Date(customer.created_at),
        // Add these fields:
        nip: customer.nip || "",
        regon: customer.regon || "",
        krs: customer.krs || "",
        contact_first_name: customer.contact_first_name || "",
        contact_last_name: customer.contact_last_name || "",
        contact_position: customer.contact_position || "",
        address: customer.addresses ? {
          street: customer.addresses.street || "",
          city: customer.addresses.city || "",
          postal_code: customer.addresses.postal_code || "",
          country: customer.addresses.country || "Polska"
        } : undefined
      };
    } else {
      return {
        displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || "Użytkownik",
        email: user.email || "",
        phone: "",
        company: "",
        createdAt: new Date(user.created_at)
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};


export const fetchCurrentServices = async (user: User | null): Promise<Service[]> => {
  try {
    if (user === null) {
      return [];
    }

    // Query orders with their items for active/pending orders
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        created_at,
        paid_at,
        order_items (
          id,
          name,
          price,
          quantity
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['active', 'pending']);

    if (error) {
      console.error('Error fetching current services:', error);
      return [];
    }

    // Flatten order items into services
    const services: Service[] = [];
    
    ordersData?.forEach(order => {
      order.order_items?.forEach(item => {
        services.push({
          id: item.id,
          name: item.name || 'Usługa',
          status: order.status as 'active' | 'pending' | 'completed',
          startDate: new Date(order.created_at),
          endDate: order.paid_at ? new Date(order.paid_at) : undefined,
          price: item.price || 0
        });
      });
    });

    return services;
  } catch (error) {
    console.error('Error fetching current services:', error);
    return [];
  }
};

export const fetchPurchaseHistory = async (user: User | null): Promise<PurchaseHistory[]> => {
  try {
    if (user === null) {
      return [];
    }

    // Query all orders for purchase history
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        created_at,
        order_items (
          name,
          price,
          quantity
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['completed', 'pending', 'cancelled'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchase history:', error);
      return [];
    }

    // Convert orders to purchase history format
    const history: PurchaseHistory[] = ordersData?.map(order => {
      // Calculate total amount for the order
      const totalAmount = order.order_items?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0) || 0;

      // Get service names (show first item name, or indicate multiple)
      const serviceNames = order.order_items?.map(item => item.name) || [];
      const serviceName = serviceNames.length === 1 
        ? serviceNames[0] 
        : serviceNames.length > 1 
          ? `${serviceNames[0]} (+${serviceNames.length - 1} więcej)`
          : 'Usługa';

      return {
        id: order.id,
        serviceName,
        status: order.status as 'completed' | 'pending' | 'cancelled',
        date: new Date(order.created_at),
        amount: totalAmount
      };
    }) || [];

    return history;
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return [];
  }
};

// Additional helper function to get detailed order information
export const fetchOrderDetails = async (orderId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (
          company_name,
          email,
          contact_first_name,
          contact_last_name,
          contact_phone,
          addresses (
            street,
            city,
            postal_code,
            country
          )
        ),
        order_items (
          *,
          services (
            name,
            description,
            category
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
};

// Helper function to get user's customer ID
export const getUserCustomerId = async (user: User | null): Promise<string | null> => {
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching customer ID:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error fetching customer ID:', error);
    return null;
  }
};