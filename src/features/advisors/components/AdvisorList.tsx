import { Stack } from '@mui/material';
import type { Advisor } from '../types/advisor.types';
import { AdvisorCard } from './AdvisorCard';

interface AdvisorListProps {
  advisors: Advisor[];
}

export function AdvisorList({ advisors }: AdvisorListProps) {
  return (
    <Stack spacing={2} aria-label="Advisor listings">
      {advisors.map((advisor) => (
        <AdvisorCard key={advisor.id} advisor={advisor} />
      ))}
    </Stack>
  );
}
