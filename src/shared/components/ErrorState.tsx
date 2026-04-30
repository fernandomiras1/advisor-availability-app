import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  const { t } = useTranslation();
  return <Alert severity="error">{message ?? t('states.error')}</Alert>;
}
