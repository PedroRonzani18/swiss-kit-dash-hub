import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNavigationModulesForUser } from "@/app/navigation/modules";
import { useAuth } from "@/auth";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = useAuth();
  const { t } = useTranslation();
  const navigationModules = getNavigationModulesForUser(permissions);

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
      <CommandInput placeholder={t("navigation.commandPlaceholder")} />
      <CommandList>
        <CommandEmpty>{t("navigation.commandEmpty")}</CommandEmpty>
        <CommandGroup heading={t("navigation.commandHeading")}>
          {navigationModules.map((module) => (
            <CommandItem
              key={module.id}
              onSelect={() => handleNavigate(module.path)}
            >
              <module.icon className="mr-2 h-4 w-4" />
              <span className="font-medium">{t(module.labelKey)}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {t(module.descriptionKey)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
