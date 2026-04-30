import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function EmptyState() {
  const { t } = useTranslation();
  return <Alert severity="info">{t('states.empty')}</Alert>;
}
