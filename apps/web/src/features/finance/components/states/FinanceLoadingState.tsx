import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function FinanceLoadingState() {
  return (
    <div className="max-w-xl mx-auto pt-24">
      <Card>
        <CardHeader>
          <CardTitle>Carregando dados financeiros...</CardTitle>
          <CardDescription>
            Estamos buscando contas, categorias e transações na API.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
