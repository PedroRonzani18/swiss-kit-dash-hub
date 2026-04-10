import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FinanceDashboardHeaderProps = {
  onOpenNewTransaction: () => void;
};

export function FinanceDashboardHeader({
  onOpenNewTransaction,
}: FinanceDashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">
          Dashboard Financeiro
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas finanças pessoais com controle total.
        </p>
      </div>
      <Button onClick={onOpenNewTransaction} className="gap-1">
        <Plus className="h-4 w-4" />
        Nova Transação
      </Button>
    </div>
  );
}
