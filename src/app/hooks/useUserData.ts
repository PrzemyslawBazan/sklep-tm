import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchUserProfile, 
  fetchCurrentServices, 
  fetchPurchaseHistory,
  type UserProfile,
  type Service,
  type PurchaseHistory
} from '../api/user/userApi';

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => fetchUserProfile(user),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCurrentServices = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['currentServices', user?.id],
    queryFn: () => fetchCurrentServices(user),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const usePurchaseHistory = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['purchaseHistory', user?.id],
    queryFn: () => fetchPurchaseHistory(user),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minutes
    retry: 2,
  });
};

// Combined hook for easier usage
export const useUserData = () => {
  const { user } = useAuth();
  const profileQuery = useUserProfile();
  const servicesQuery = useCurrentServices();
  const historyQuery = usePurchaseHistory();

  return {
    user, 
    profile: profileQuery,
    services: servicesQuery,
    history: historyQuery,
    
    isLoading: profileQuery.isLoading || servicesQuery.isLoading || historyQuery.isLoading,
    hasError: profileQuery.isError || servicesQuery.isError || historyQuery.isError,
    
    data: {
      userProfile: profileQuery.data,
      currentServices: servicesQuery.data || [],
      purchaseHistory: historyQuery.data || [],
    },
    
    errors: {
      profile: profileQuery.error,
      services: servicesQuery.error,
      history: historyQuery.error,
    }
  };
};
