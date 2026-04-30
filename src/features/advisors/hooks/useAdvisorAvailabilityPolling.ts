import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAdvisorAvailability } from '../services/advisorsApi';
import type { Advisor } from '../types/advisor.types';
import { ADVISORS_POLLING_INTERVAL_MS } from '../config/advisors.config';
import { ADVISORS_QUERY_KEY } from './useAdvisors';

export function useAdvisorAvailabilityPolling(visibleAdvisorIds: number[]) {
  const queryClient = useQueryClient();
  const advisorIdsKey = visibleAdvisorIds.join(',');

  useEffect(() => {
    if (advisorIdsKey.length === 0) return;

    let isActive = true;
    let isFetching = false;
    const advisorIds = advisorIdsKey.split(',').map(Number);

    const updateAvailability = async () => {
      if (isFetching) return;
      isFetching = true;
      const updates = await Promise.allSettled(
        advisorIds.map((advisorId) => getAdvisorAvailability(advisorId)),
      );
      isFetching = false;

      if (!isActive) return;

      const updatesByAdvisorId = new Map(
        updates
          .filter(
            (
              update,
            ): update is PromiseFulfilledResult<{
              advisorId: number;
              callAvailable: boolean;
              chatAvailable: boolean;
            }> => update.status === 'fulfilled',
          )
          .map((update) => [update.value.advisorId, update.value]),
      );

      queryClient.setQueryData<Advisor[]>(ADVISORS_QUERY_KEY, (currentAdvisors = []) => {
        let hasChanges = false;

        const nextAdvisors = currentAdvisors.map((advisor) => {
          const availabilityResult = updatesByAdvisorId.get(advisor.id);

          if (!availabilityResult) {
            return advisor;
          }

          if (
            advisor.isCallAvailable === availabilityResult.callAvailable &&
            advisor.isChatAvailable === availabilityResult.chatAvailable
          ) {
            return advisor;
          }

          hasChanges = true;

          return {
            ...advisor,
            isCallAvailable: availabilityResult.callAvailable,
            isChatAvailable: availabilityResult.chatAvailable,
          };
        });

        return hasChanges ? nextAdvisors : currentAdvisors;
      });
    };

    void updateAvailability();
    const intervalId = window.setInterval(updateAvailability, ADVISORS_POLLING_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [advisorIdsKey, queryClient]);
}
