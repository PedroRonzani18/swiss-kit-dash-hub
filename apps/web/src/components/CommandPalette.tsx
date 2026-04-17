import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { APP_MODULES } from "@/app/navigation/modules";
import {
  buildFinancePath,
  FINANCE_ACTION_ROUTES,
} from "@/features/finance/navigation";
import { CirclePlus, ListChecks, Tags, WalletCards } from "lucide-react";

type TaskCommand = {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: typeof CirclePlus;
};

const FINANCE_TASK_COMMANDS: TaskCommand[] = [
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

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigate = (path: string) => {
    setOpen(false);

    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar módulos e ações..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Ações Rápidas">
          {FINANCE_TASK_COMMANDS.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => handleNavigate(command.path)}
            >
              <command.icon className="mr-2 h-4 w-4" />
              <span className="font-medium">{command.label}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {command.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Navegação">
          {APP_MODULES.map((module) => (
            <CommandItem
              key={module.id}
              onSelect={() => handleNavigate(module.path)}
            >
              <module.icon className="mr-2 h-4 w-4" />
              <span className="font-medium">{module.label}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {module.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
