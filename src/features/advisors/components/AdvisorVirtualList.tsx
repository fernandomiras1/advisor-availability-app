import { Box } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Advisor } from '../types/advisor.types';
import { AdvisorCard } from './AdvisorCard';

interface AdvisorVirtualListProps {
  advisors: Advisor[];
}

export function AdvisorVirtualList({ advisors }: AdvisorVirtualListProps) {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: advisors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 132,
    overscan: 4,
  });

  return (
    <Box
      ref={parentRef}
      sx={{ height: 520, overflow: 'auto', pr: 1 }}
      aria-label={t('a11y.virtualList')}
    >
      <Box
        sx={{
          height: rowVirtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const advisor = advisors[virtualRow.index];

          return (
            <Box
              key={advisor.id}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                pb: 2,
              }}
            >
              <AdvisorCard advisor={advisor} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
