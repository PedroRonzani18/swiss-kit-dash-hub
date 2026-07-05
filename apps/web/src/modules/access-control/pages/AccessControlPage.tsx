import { AppLayout } from '@/components/AppLayout';
import { Container } from '@/components/ui/container';
import { AccessControlOverviewContent } from '@/features/access-control/components/AccessControlOverviewContent';
import { useAccessControlOverview } from '@/features/access-control/hooks/useAccessControlOverview';
import { useTranslation } from 'react-i18next';

export function AccessControlPage() {
  const query = useAccessControlOverview();
  const { t } = useTranslation();

  return (
    <AppLayout
      breadcrumbs={[
        t('common.brand'),
        t('navigation.modules.accessControl.label'),
      ]}
    >
      <Container>
        <AccessControlOverviewContent query={query} />
      </Container>
    </AppLayout>
  );
}
