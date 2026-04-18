import { CirclePlus, ListChecks, Tags, WalletCards } from "lucide-react";
import { buildFinancePath, FINANCE_ACTION_ROUTES } from "./navigation";

export type FinanceTaskCommand = {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: typeof CirclePlus;
};

export const FINANCE_TASK_COMMANDS: FinanceTaskCommand[] = [
  {
    id: "finance-new-transaction",
    label: "Nova Transação",
    description: "Abrir formulário para novo lançamento.",
    path: buildFinancePath("transactions", FINANCE_ACTION_ROUTES.newTransaction),
    icon: CirclePlus,
  },
  {
    id: "finance-transactions",
    label: "Ir para Transações",
    description: "Ver e filtrar lançamentos financeiros.",
    path: buildFinancePath("transactions"),
    icon: ListChecks,
  },
  {
    id: "finance-accounts",
    label: "Ir para Contas",
    description: "Cadastrar e revisar contas.",
    path: buildFinancePath("accounts"),
    icon: WalletCards,
  },
  {
    id: "finance-categories",
    label: "Ir para Categorias",
    description: "Gerenciar categorias e subcategorias.",
    path: buildFinancePath("categories"),
    icon: Tags,
  },
];
