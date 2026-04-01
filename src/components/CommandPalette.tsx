import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Wallet, Tv, Wrench, Settings } from "lucide-react";

const routes = [
  { label: "Financeiro", icon: Wallet, path: "/" },
  { label: "Animes", icon: Tv, path: "/animes" },
  { label: "Ferramentas", icon: Wrench, path: "/ferramentas" },
  { label: "Configurações", icon: Settings, path: "/configuracoes" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar módulos..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Navegação">
          {routes.map((r) => (
            <CommandItem key={r.path} onSelect={() => setOpen(false)}>
              <r.icon className="mr-2 h-4 w-4" />
              <span>{r.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
