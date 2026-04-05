import { useMemo, useState } from "react";
import { Account, AccountType } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";

type CreateAccountPayload = {
  name: string;
  type: AccountType;
  institution?: string;
  openingBalance?: number;
};

interface AccountManagerProps {
  accounts: Account[];
  onAddAccount: (input: CreateAccountPayload) => Promise<"duplicate" | "success">;
}

const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  credit_card: "Cartão",
  cash: "Dinheiro",
};

function formatCurrencyFromCents(value: number): string {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function AccountManager({ accounts, onAddAccount }: AccountManagerProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [institution, setInstitution] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedAccounts = useMemo(
    () => [...accounts].sort((a, b) => a.name.localeCompare(b.name)),
    [accounts],
  );

  const handleAddAccount = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome da conta");
      return;
    }

    const parsedBalance = openingBalance.trim() ? Number(openingBalance) : 0;
    if (Number.isNaN(parsedBalance) || parsedBalance < 0) {
      toast.error("Saldo inicial inválido");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onAddAccount({
        name: name.trim(),
        type,
        institution: institution.trim() || undefined,
        openingBalance: parsedBalance,
      });

      if (result === "duplicate") {
        toast.error("Já existe uma conta com esse nome");
        return;
      }

      toast.success("Conta criada com sucesso");
      setName("");
      setInstitution("");
      setOpeningBalance("");
      setType("checking");
    } catch {
      toast.error("Não foi possível criar a conta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        Contas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input
          placeholder="Nome da conta"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Select value={type} onValueChange={(value) => setType(value as AccountType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Conta Corrente</SelectItem>
            <SelectItem value="savings">Poupança</SelectItem>
            <SelectItem value="credit_card">Cartão</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Instituição (opcional)"
          value={institution}
          onChange={(event) => setInstitution(event.target.value)}
        />

        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Saldo inicial"
          value={openingBalance}
          onChange={(event) => setOpeningBalance(event.target.value)}
        />
      </div>

      <Button onClick={handleAddAccount} disabled={isSubmitting} className="gap-1">
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Salvando..." : "Adicionar Conta"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {sortedAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-card border border-border rounded-lg p-3 text-sm animate-fade-in"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-card-foreground">{account.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {account.institution || "Sem instituição"}
                </p>
              </div>
              <Badge variant="outline">{ACCOUNT_TYPE_LABEL[account.type]}</Badge>
            </div>

            <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
              <span>Saldo inicial</span>
              <span className="font-mono-code text-foreground">
                {formatCurrencyFromCents(account.openingBalanceCents)}
              </span>
            </div>
          </div>
        ))}

        {sortedAccounts.length === 0 && (
          <div className="col-span-full border border-dashed border-border rounded-lg p-6 text-sm text-muted-foreground">
            Nenhuma conta cadastrada ainda. Crie sua primeira conta para vincular nas transações.
          </div>
        )}
      </div>
    </div>
  );
}
