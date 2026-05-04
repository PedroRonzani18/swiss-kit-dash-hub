import { useMemo, useState } from "react";
import { AccountOption, Category, Transaction } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowUpDown,
  CalendarIcon,
  Filter,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransactionTableFilters } from "@/features/finance/hooks";

interface TransactionTableProps {
  accounts: AccountOption[];
  transactions: Transaction[];
  categories: Category[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
}

type TableFilterType = "" | "income" | "expense";

type DraftFilters = {
  selectedAccounts: string[];
  dateFrom?: Date;
  dateTo?: Date;
  filterCategoryId: string;
  filterSubcategoryId: string;
  filterType: TableFilterType;
};

type FilterChipId =
  | "search"
  | "accounts"
  | "period"
  | "type"
  | "category"
  | "subcategory";

type FilterChip = {
  id: FilterChipId;
  label: string;
  variant: "outline" | "secondary" | "success" | "destructive";
};

const TYPE_OPTIONS: Array<{
  value: TableFilterType;
  label: string;
  activeVariant: "secondary" | "success" | "destructive";
}> = [
  { value: "", label: "Ambos", activeVariant: "secondary" },
  { value: "income", label: "Receita", activeVariant: "success" },
  { value: "expense", label: "Despesa", activeVariant: "destructive" },
];

function formatPeriod(dateFrom?: Date, dateTo?: Date): string {
  if (!dateFrom && !dateTo) {
    return "Todos os períodos";
  }

  const from = dateFrom ? format(dateFrom, "dd/MM/yy") : "Início";
  const to = dateTo ? format(dateTo, "dd/MM/yy") : "Hoje";
  return `${from} - ${to}`;
}

function buildTypeLabel(type: TableFilterType): string {
  if (type === "income") {
    return "Receita";
  }

  if (type === "expense") {
    return "Despesa";
  }

  return "Ambos";
}

function TypeSegmentedControl({
  value,
  onChange,
  className,
}: {
  value: TableFilterType;
  onChange: (value: TableFilterType) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 h-9 rounded-md border border-border/70 bg-background/50 p-1",
        className,
      )}
      role="radiogroup"
      aria-label="Filtro por tipo"
    >
      {TYPE_OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              badgeVariants({
                variant: isActive ? option.activeVariant : "outline",
              }),
              "h-7 px-2 text-[11px] font-medium cursor-pointer",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function TransactionTable({
  accounts,
  transactions,
  categories,
  getCategoryName,
  getSubcategoryName,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const {
    search,
    setSearch,
    sortAsc,
    setSortAsc,
    selectedAccounts,
    setSelectedAccounts,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filterCategoryId,
    setFilterCategoryId,
    filterSubcategoryId,
    setFilterSubcategoryId,
    filterType,
    setFilterType,
    filterCategory,
    filteredTransactions,
    hasFilters,
    toggleAccount,
    handleCategoryChange,
    handleSubcategoryChange,
    clearFilters,
  } = useTransactionTableFilters({
    transactions,
    categories,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState<DraftFilters>({
    selectedAccounts,
    dateFrom,
    dateTo,
    filterCategoryId,
    filterSubcategoryId,
    filterType,
  });

  const draftFilterCategory = useMemo(
    () =>
      categories.find((category) => category.id === draftFilters.filterCategoryId),
    [categories, draftFilters.filterCategoryId],
  );

  const periodLabel = useMemo(
    () => formatPeriod(dateFrom, dateTo),
    [dateFrom, dateTo],
  );

  const activeFilterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];

    if (search) {
      chips.push({
        id: "search",
        label: `Busca: ${search}`,
        variant: "secondary",
      });
    }

    if (selectedAccounts.length > 0) {
      const accountLabel =
        selectedAccounts.length === 1
          ? accounts.find((account) => account.id === selectedAccounts[0])?.label ||
            "Conta"
          : `${selectedAccounts.length} contas`;

      chips.push({
        id: "accounts",
        label: `Conta: ${accountLabel}`,
        variant: "outline",
      });
    }

    if (dateFrom || dateTo) {
      chips.push({
        id: "period",
        label: `Período: ${periodLabel}`,
        variant: "outline",
      });
    }

    if (filterType) {
      chips.push({
        id: "type",
        label: `Tipo: ${buildTypeLabel(filterType)}`,
        variant: filterType === "income" ? "success" : "destructive",
      });
    }

    if (filterCategoryId) {
      chips.push({
        id: "category",
        label: `Categoria: ${getCategoryName(filterCategoryId)}`,
        variant: "outline",
      });
    }

    if (filterSubcategoryId && filterCategoryId) {
      chips.push({
        id: "subcategory",
        label: `Subcategoria: ${getSubcategoryName(
          filterCategoryId,
          filterSubcategoryId,
        )}`,
        variant: "outline",
      });
    }

    return chips;
  }, [
    search,
    selectedAccounts,
    accounts,
    dateFrom,
    dateTo,
    periodLabel,
    filterType,
    filterCategoryId,
    filterSubcategoryId,
    getCategoryName,
    getSubcategoryName,
  ]);

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  const syncDraftWithCurrentFilters = () => {
    setDraftFilters({
      selectedAccounts,
      dateFrom,
      dateTo,
      filterCategoryId,
      filterSubcategoryId,
      filterType,
    });
  };

  const openMobileFilters = () => {
    syncDraftWithCurrentFilters();
    setIsMobileFiltersOpen(true);
  };

  const clearAllFilters = () => {
    clearFilters();
    setDraftFilters({
      selectedAccounts: [],
      dateFrom: undefined,
      dateTo: undefined,
      filterCategoryId: "",
      filterSubcategoryId: "",
      filterType: "",
    });
  };

  const applyMobileFilters = () => {
    setSelectedAccounts(draftFilters.selectedAccounts);
    setDateFrom(draftFilters.dateFrom);
    setDateTo(draftFilters.dateTo);
    setFilterCategoryId(draftFilters.filterCategoryId);
    setFilterSubcategoryId(draftFilters.filterSubcategoryId);
    setFilterType(draftFilters.filterType);
    setIsMobileFiltersOpen(false);
  };

  const toggleDraftAccount = (accountId: string) => {
    setDraftFilters((previous) => ({
      ...previous,
      selectedAccounts: previous.selectedAccounts.includes(accountId)
        ? previous.selectedAccounts.filter((value) => value !== accountId)
        : [...previous.selectedAccounts, accountId],
    }));
  };

  const handleRemoveFilterChip = (chipId: FilterChipId) => {
    switch (chipId) {
      case "search":
        setSearch("");
        break;
      case "accounts":
        setSelectedAccounts([]);
        break;
      case "period":
        setDateFrom(undefined);
        setDateTo(undefined);
        break;
      case "type":
        setFilterType("");
        break;
      case "category":
        handleCategoryChange("all");
        break;
      case "subcategory":
        handleSubcategoryChange("all");
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      toast.success("Transação removida");
      setDeleteId(null);
    } catch {
      toast.error("Não foi possível remover a transação");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-9 gap-1"
            onClick={openMobileFilters}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="hidden md:flex md:flex-col gap-2 rounded-lg border border-border/70 bg-surface-subtle/40 p-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-64">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Buscar
              </p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-8"
                />
              </div>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Conta
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 text-xs">
                    Conta {selectedAccounts.length > 0 && `(${selectedAccounts.length})`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-2 pointer-events-auto">
                  {accounts.map((account) => (
                    <label
                      key={account.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-accent"
                    >
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={() => toggleAccount(account.id)}
                      />
                      {account.label}
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Período
              </p>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 text-xs gap-1",
                        !dateFrom && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {dateFrom ? format(dateFrom, "dd/MM/yy") : "De"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      locale={ptBR}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 text-xs gap-1",
                        !dateTo && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {dateTo ? format(dateTo, "dd/MM/yy") : "Até"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      locale={ptBR}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Tipo
              </p>
              <TypeSegmentedControl value={filterType} onChange={setFilterType} />
            </div>

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Categoria
              </p>
              <Select value={filterCategoryId || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-40 h-9 text-xs">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filterCategory && (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Subcategoria
                </p>
                <Select
                  value={filterSubcategoryId || "all"}
                  onValueChange={handleSubcategoryChange}
                >
                  <SelectTrigger className="w-40 h-9 text-xs">
                    <SelectValue placeholder="Subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {filterCategory.subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 text-xs gap-1 text-muted-foreground ml-auto"
              >
                <X className="h-3 w-3" /> Limpar
              </Button>
            )}
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleRemoveFilterChip(chip.id)}
                  className={cn(
                    badgeVariants({ variant: chip.variant }),
                    "h-7 cursor-pointer gap-1 px-2 text-[11px]",
                  )}
                >
                  <span>{chip.label}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {activeFilterChips.length > 0 && (
          <div className="md:hidden flex flex-wrap items-center gap-2">
            {activeFilterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleRemoveFilterChip(chip.id)}
                className={cn(
                  badgeVariants({ variant: chip.variant }),
                  "h-7 cursor-pointer gap-1 px-2 text-[11px]",
                )}
              >
                <span>{chip.label}</span>
                <X className="h-3 w-3" />
              </button>
            ))}

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-[11px] gap-1 text-muted-foreground"
              >
                <X className="h-3 w-3" /> Limpar
              </Button>
            )}
          </div>
        )}
      </div>

      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="right" className="w-[92vw] sm:max-w-sm flex flex-col">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Ajuste tipo, período, conta e classificação das transações.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tipo
              </p>
              <TypeSegmentedControl
                value={draftFilters.filterType}
                onChange={(value) =>
                  setDraftFilters((previous) => ({ ...previous, filterType: value }))
                }
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Período
              </p>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 text-xs gap-1 flex-1",
                        !draftFilters.dateFrom && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {draftFilters.dateFrom
                        ? format(draftFilters.dateFrom, "dd/MM/yy")
                        : "De"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={draftFilters.dateFrom}
                      onSelect={(value) =>
                        setDraftFilters((previous) => ({ ...previous, dateFrom: value }))
                      }
                      locale={ptBR}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 text-xs gap-1 flex-1",
                        !draftFilters.dateTo && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {draftFilters.dateTo
                        ? format(draftFilters.dateTo, "dd/MM/yy")
                        : "Até"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={draftFilters.dateTo}
                      onSelect={(value) =>
                        setDraftFilters((previous) => ({ ...previous, dateTo: value }))
                      }
                      locale={ptBR}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Categoria
              </p>
              <Select
                value={draftFilters.filterCategoryId || "all"}
                onValueChange={(value) =>
                  setDraftFilters((previous) => ({
                    ...previous,
                    filterCategoryId: value === "all" ? "" : value,
                    filterSubcategoryId: "",
                  }))
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {draftFilterCategory && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Subcategoria
                </p>
                <Select
                  value={draftFilters.filterSubcategoryId || "all"}
                  onValueChange={(value) =>
                    setDraftFilters((previous) => ({
                      ...previous,
                      filterSubcategoryId: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {draftFilterCategory.subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Conta
              </p>
              <div className="space-y-2 rounded-md border border-border/70 p-2">
                {accounts.map((account) => (
                  <label
                    key={account.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-sm hover:bg-accent"
                  >
                    <Checkbox
                      checked={draftFilters.selectedAccounts.includes(account.id)}
                      onCheckedChange={() => toggleDraftAccount(account.id)}
                    />
                    {account.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border/70 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                clearAllFilters();
                setIsMobileFiltersOpen(false);
              }}
            >
              Limpar
            </Button>
            <Button type="button" onClick={applyMobileFilters}>
              Aplicar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-28">Conta</TableHead>
              <TableHead
                className="w-28 cursor-pointer select-none"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <span className="flex items-center gap-1">
                  Data
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-32 text-right">Valor</TableHead>
              <TableHead className="w-28">Categoria</TableHead>
              <TableHead className="w-28">Subcategoria</TableHead>
              <TableHead className="w-20 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="animate-fade-in group">
                <TableCell className="text-xs font-mono-code">{transaction.accountName}</TableCell>
                <TableCell className="text-xs font-mono-code">{formatDate(transaction.date)}</TableCell>
                <TableCell className="text-sm">{transaction.description}</TableCell>
                <TableCell
                  className={cn(
                    "text-right text-sm font-medium font-mono-code",
                    transaction.type === "income"
                      ? "text-status-success"
                      : "text-destructive",
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {getCategoryName(transaction.categoryId)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {getSubcategoryName(transaction.categoryId, transaction.subcategoryId)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(transaction)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteId(transaction.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
