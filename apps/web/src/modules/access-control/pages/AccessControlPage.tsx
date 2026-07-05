import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Container } from '@/components/ui/container';
import { AccessControlOverviewContent } from '@/features/access-control/components/AccessControlOverviewContent';
import { useAccessControlOverview } from '@/features/access-control/hooks/useAccessControlOverview';
import { ShieldCheck } from 'lucide-react';
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
      <Container className="flex flex-col gap-6">
        <PageHeader
          eyebrow={t('navigation.modules.accessControl.label')}
          icon={ShieldCheck}
          title={t('accessControl.title')}
          description={t('accessControl.description')}
        />
        <AccessControlOverviewContent query={query} />
      </Container>
    </AppLayout>
  );
}
