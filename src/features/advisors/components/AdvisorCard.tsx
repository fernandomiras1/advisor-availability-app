import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { Advisor } from '../types/advisor.types';
import { AdvisorActions } from './AdvisorActions';

interface AdvisorCardProps {
  advisor: Advisor;
}

export function AdvisorCard({ advisor }: AdvisorCardProps) {
  return (
    <Card component="article" aria-label={`Advisor ${advisor.name}`}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Avatar
              src={advisor.profilePictureUrl}
              alt={advisor.name}
              sx={{ width: 72, height: 72, flexShrink: 0 }}
            />

            <Box>
              <Typography variant="h2" noWrap>
                {advisor.name}
              </Typography>
              <Typography color="text.secondary">{advisor.price}</Typography>
            </Box>
          </Stack>

          <AdvisorActions
            isCallAvailable={advisor.isCallAvailable}
            isChatAvailable={advisor.isChatAvailable}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
