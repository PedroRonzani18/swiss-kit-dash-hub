import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountOption, Category, Transaction } from "@/types/finance";
import type { TransactionDraft } from "@/features/finance/types";
import { Plus, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface RowDraft {
  type: "income" | "expense";
  accountId: string;
  date: Date | undefined;
  description: string;
  amount: string;
  categoryId: string;
  subcategoryId: string;
}

const emptyRow = (): RowDraft => ({
  type: "expense",
  accountId: "",
  date: undefined,
  description: "",
  amount: "",
  categoryId: "",
  subcategoryId: "",
});

interface TransactionFormProps {
  accounts: AccountOption[];
  categories: Category[];
  onSave: (drafts: TransactionDraft[]) => Promise<void>;
  initialData?: Transaction;
}

export function TransactionForm({
  accounts,
  categories,
  onSave,
  initialData,
}: TransactionFormProps) {
  const [rows, setRows] = useState<RowDraft[]>([emptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setRows([{
        type: initialData.type,
        accountId: initialData.accountId,
        date: new Date(initialData.date + "T12:00:00"),
        description: initialData.description,
        amount: String(initialData.amount),
        categoryId: initialData.categoryId,
        subcategoryId: initialData.subcategoryId,
      }]);
      return;
    }
    setRows([emptyRow()]);
  }, [initialData]);

  const updateRow = (i: number, patch: Partial<RowDraft>) => {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  const addRow = () => {
    const last = rows[rows.length - 1];
    setRows((prev) => [
      ...prev,
      { ...last, description: "", amount: "" } as RowDraft,
    ]);
  };

  const removeRow = (i: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    const valid = rows.every(
      (r) => r.accountId && r.description && r.amount && r.categoryId && r.subcategoryId,
    );
    if (!valid) return;

    setIsSubmitting(true);
    try {
      const drafts: TransactionDraft[] = rows.map((r) => ({
        accountId: r.accountId,
        date: r.date ? format(r.date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        description: r.description,
        amount: parseFloat(r.amount),
        type: r.type,
        categoryId: r.categoryId,
        subcategoryId: r.subcategoryId,
      }));
      await onSave(drafts);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Column headers */}
      {!isEditing && (
        <div className="grid grid-cols-[64px_1fr_110px_1fr_96px_1fr_1fr_32px] gap-2 px-1">
          <span className="text-sm text-muted-foreground">Tipo</span>
          <span className="text-sm text-muted-foreground">Conta</span>
          <span className="text-sm text-muted-foreground">Data</span>
          <span className="text-sm text-muted-foreground">Descrição</span>
          <span className="text-sm text-muted-foreground">Valor</span>
          <span className="text-sm text-muted-foreground">Categoria</span>
          <span className="text-sm text-muted-foreground">Subcategoria</span>
          <span />
        </div>
      )}

      <div className="space-y-2">
        {rows.map((row, i) => {
          const selectedCategory = categories.find((c) => c.id === row.categoryId);
          const filteredCategories = categories.filter((c) => c.type === row.type);

          if (isEditing) {
            return (
              <div key={i} className="space-y-4">
                <div className="flex gap-1 bg-secondary rounded-md p-1 w-fit">
                  <button
                    onClick={() => updateRow(i, { type: "income", categoryId: "", subcategoryId: "" })}
                    className={cn(
                      "px-3 py-1 text-xs rounded transition-colors font-medium",
                      row.type === "income" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Receita
                  </button>
                  <button
                    onClick={() => updateRow(i, { type: "expense", categoryId: "", subcategoryId: "" })}
                    className={cn(
                      "px-3 py-1 text-xs rounded transition-colors font-medium",
                      row.type === "expense" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Despesa
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={row.accountId} onValueChange={(v) => updateRow(i, { accountId: v })}>
                    <SelectTrigger><SelectValue placeholder="Conta" /></SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !row.date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {row.date ? format(row.date, "dd/MM/yyyy") : "Hoje"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={row.date} onSelect={(d) => updateRow(i, { date: d })} locale={ptBR} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                  <Input placeholder="Descrição" value={row.description} onChange={(e) => updateRow(i, { description: e.target.value })} />
                  <Input placeholder="R$ 0,00" type="number" step="0.01" value={row.amount} onChange={(e) => updateRow(i, { amount: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={row.categoryId} onValueChange={(v) => updateRow(i, { categoryId: v, subcategoryId: "" })}>
                    <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={row.subcategoryId} onValueChange={(v) => updateRow(i, { subcategoryId: v })} disabled={!selectedCategory}>
                    <SelectTrigger><SelectValue placeholder="Subcategoria" /></SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.subcategories.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="grid grid-cols-[64px_1fr_110px_1fr_96px_1fr_1fr_32px] gap-2 items-center">
              {/* Type toggle */}
              <div className="flex gap-0.5 bg-secondary rounded p-0.5">
                <button
                  onClick={() => updateRow(i, { type: "income", categoryId: "", subcategoryId: "" })}
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded transition-colors font-medium flex-1",
                    row.type === "income" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  R
                </button>
                <button
                  onClick={() => updateRow(i, { type: "expense", categoryId: "", subcategoryId: "" })}
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded transition-colors font-medium flex-1",
                    row.type === "expense" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  D
                </button>
              </div>

              {/* Account */}
              <Select value={row.accountId} onValueChange={(v) => updateRow(i, { accountId: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Conta" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("h-9 w-full justify-start text-left text-sm font-normal px-2", !row.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1 h-4 w-4 shrink-0" />
                    {row.date ? format(row.date, "dd/MM/yy") : "Hoje"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={row.date} onSelect={(d) => updateRow(i, { date: d })} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              {/* Description */}
              <Input className="h-9 text-sm" placeholder="Descrição" value={row.description} onChange={(e) => updateRow(i, { description: e.target.value })} />

              {/* Amount */}
              <Input className="h-9 text-sm" placeholder="0,00" type="number" step="0.01" value={row.amount} onChange={(e) => updateRow(i, { amount: e.target.value })} />

              {/* Category */}
              <Select value={row.categoryId} onValueChange={(v) => updateRow(i, { categoryId: v, subcategoryId: "" })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Subcategory */}
              <Select value={row.subcategoryId} onValueChange={(v) => updateRow(i, { subcategoryId: v })} disabled={!selectedCategory}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Subcategoria" /></SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Remove */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(i)}
                disabled={rows.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className={cn("flex gap-2", isEditing ? "" : "justify-between items-center")}>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={addRow} className="gap-1 text-sm">
            <Plus className="h-4 w-4" />
            Adicionar linha
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          className={cn("gap-1", isEditing ? "w-full" : "")}
          disabled={isSubmitting}
          size={isEditing ? "default" : "sm"}
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-3.5 w-3.5" />}
          {isSubmitting
            ? "Salvando..."
            : isEditing
              ? "Salvar Alterações"
              : rows.length === 1
                ? "Adicionar Transação"
                : `Adicionar ${rows.length} Transações`}
        </Button>
      </div>
    </div>
  );
}
