import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type UnauthenticatedFinanceStateProps = {
  isAuthLoading: boolean;
  onLogin: () => Promise<void>;
};

export function UnauthenticatedFinanceState({
  isAuthLoading,
  onLogin,
}: UnauthenticatedFinanceStateProps) {
  return (
    <div className="max-w-xl mx-auto pt-24">
      <Card>
        <CardHeader>
          <CardTitle>Acesse seu dashboard financeiro</CardTitle>
          <CardDescription>
            Faça login com Google para carregar seus dados reais da API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onLogin} disabled={isAuthLoading}>
            {isAuthLoading ? "Entrando..." : "Entrar com Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
