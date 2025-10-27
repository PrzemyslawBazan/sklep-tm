import { useQuery } from '@tanstack/react-query';
import { fetchActiveServices } from '../api/services/servicesApi';

export const useServices = () => {
  return useQuery({
    queryKey: ['services', 'active'],
    queryFn: fetchActiveServices,
    staleTime: 5 * 60 * 1000, 
    retry: 2,
    refetchOnWindowFocus: false, 
  });
};