import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function FinanceErrorState() {
  return (
    <div className="max-w-xl mx-auto pt-24">
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar dados</CardTitle>
          <CardDescription>
            Não foi possível carregar os recursos financeiros da API. Atualize a
            página ou confira sua autenticação.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
