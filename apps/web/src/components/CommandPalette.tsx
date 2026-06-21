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
