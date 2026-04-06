import { useState, useMemo } from "react";
import { AccountOption, Transaction, Category } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ArrowUpDown, Search, Pencil, Trash2, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionTableProps {
  accounts: AccountOption[];
  transactions: Transaction[];
  categories: Category[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
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
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterSubcategoryId, setFilterSubcategoryId] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((a) => a !== accountId) : [...prev, accountId]
    );
  };

  const filterCategory = categories.find((c) => c.id === filterCategoryId);

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedAccounts.length > 0 && !selectedAccounts.includes(t.accountId)) return false;
      if (dateFrom) {
        const td = new Date(t.date);
        if (td < dateFrom) return false;
      }
      if (dateTo) {
        const td = new Date(t.date);
        if (td > dateTo) return false;
      }
      if (filterCategoryId && t.categoryId !== filterCategoryId) return false;
      if (filterSubcategoryId && t.subcategoryId !== filterSubcategoryId) return false;
      return true;
    });
    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortAsc ? diff : -diff;
    });
    return result;
  }, [transactions, search, sortAsc, selectedAccounts, dateFrom, dateTo, filterCategoryId, filterSubcategoryId]);

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  const hasFilters = search || selectedAccounts.length > 0 || dateFrom || dateTo || filterCategoryId;

  const clearFilters = () => {
    setSearch("");
    setSelectedAccounts([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setFilterCategoryId("");
    setFilterSubcategoryId("");
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
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
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-end">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-48"
          />
        </div>

        {/* Account multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              Conta {selectedAccounts.length > 0 && `(${selectedAccounts.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-2 pointer-events-auto">
            {accounts.map((account) => (
              <label key={account.id} className="flex items-center gap-2 py-1 px-1 text-sm cursor-pointer hover:bg-accent rounded">
                <Checkbox
                  checked={selectedAccounts.includes(account.id)}
                  onCheckedChange={() => toggleAccount(account.id)}
                />
                {account.label}
              </label>
            ))}
          </PopoverContent>
        </Popover>

        {/* Date from */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-9 text-xs gap-1", !dateFrom && "text-muted-foreground")}>
              <CalendarIcon className="h-3 w-3" />
              {dateFrom ? format(dateFrom, "dd/MM/yy") : "De"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} locale={ptBR} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        {/* Date to */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-9 text-xs gap-1", !dateTo && "text-muted-foreground")}>
              <CalendarIcon className="h-3 w-3" />
              {dateTo ? format(dateTo, "dd/MM/yy") : "Até"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} locale={ptBR} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        {/* Category */}
        <Select value={filterCategoryId} onValueChange={(v) => { setFilterCategoryId(v === "all" ? "" : v); setFilterSubcategoryId(""); }}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subcategory */}
        {filterCategory && (
          <Select value={filterSubcategoryId} onValueChange={(v) => setFilterSubcategoryId(v === "all" ? "" : v)}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <SelectValue placeholder="Subcategoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {filterCategory.subcategories.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs gap-1 text-muted-foreground">
            <X className="h-3 w-3" /> Limpar
          </Button>
        )}
      </div>

      {/* Table */}
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
            {filtered.map((t) => (
              <TableRow key={t.id} className="animate-fade-in group">
                <TableCell className="text-xs font-mono-code">{t.accountName}</TableCell>
                <TableCell className="text-xs font-mono-code">{formatDate(t.date)}</TableCell>
                <TableCell className="text-sm">{t.description}</TableCell>
                <TableCell
                  className={`text-right text-sm font-medium font-mono-code ${
                    t.type === "income" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {getCategoryName(t.categoryId)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {getSubcategoryName(t.categoryId, t.subcategoryId)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(t)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
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
