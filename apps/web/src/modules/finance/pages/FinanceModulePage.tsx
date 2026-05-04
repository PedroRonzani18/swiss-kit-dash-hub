import { AppLayout } from "@/components/AppLayout";
import { FinanceModuleContent } from "@/features/finance";

export function FinanceModulePage() {
  return (
    <AppLayout breadcrumbs={["SwissKit", "Financeiro"]}>
      <FinanceModuleContent />
    </AppLayout>
  );
}
