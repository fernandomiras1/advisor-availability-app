import { useQuery } from '@tanstack/react-query';
import { getAdvisors } from '../services/advisorsApi';

export const ADVISORS_QUERY_KEY = ['advisors'] as const;

export function useAdvisors() {
  return useQuery({
    queryKey: ADVISORS_QUERY_KEY,
    queryFn: getAdvisors,
  });
}
