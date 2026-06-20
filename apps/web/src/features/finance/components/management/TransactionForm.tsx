import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountOption, Category, Transaction, TransactionType } from "@/types/finance";
import type { MutationResult, TransactionDraft } from "@/features/finance/types";
import { Plus, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

interface RowDraft {
  type: "income" | "expense";
  accountId: string;
  date: Date | undefined;
  description: string;
  amount: string;
  categoryId: string;
  subcategoryId: string;
  installmentEnabled: boolean;
  installmentCount: string;
}

const emptyRow = (): RowDraft => ({
  type: "expense",
  accountId: "",
  date: undefined,
  description: "",
  amount: "",
  categoryId: "",
  subcategoryId: "",
  installmentEnabled: false,
  installmentCount: "2",
});

interface TransactionFormProps {
  accounts: AccountOption[];
  categories: Category[];
  onSave: (drafts: TransactionDraft[]) => Promise<boolean>;
  onAddCategory: (name: string, subName: string, type: TransactionType) => Promise<MutationResult>;
  initialData?: Transaction;
  onDirtyChange?: (dirty: boolean) => void;
}

type MissingFieldsByRow = {
  rowIndex: number;
  missingFields: string[];
};

function showMissingFieldsToast(missingByRow: MissingFieldsByRow[]) {
  const visibleRows = missingByRow.slice(0, 4);
  const hiddenRowsCount = missingByRow.length - visibleRows.length;
  const toastId = "finance-transaction-missing-fields";

  toast.custom((id) => (
    <button
      type="button"
      onClick={() => toast.dismiss(id)}
      className="group w-full cursor-pointer rounded-md border border-rose-500/70 bg-linear-to-br from-rose-950/90 via-slate-950 to-slate-900 p-3 text-left text-rose-50 shadow-lg transition-colors transition-shadow duration-150 hover:bg-rose-900/90 hover:shadow-rose-900/30 hover:ring-1 hover:ring-rose-300/45"
    >
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-100/90" />
          <div>
            <p className="text-lg font-semibold leading-none">Campos obrigatórios pendentes</p>
            <p className="mt-1 text-xs text-rose-100/90">
              Revise os itens abaixo antes de adicionar a transação.
            </p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {visibleRows.map((entry) => (
            <li key={entry.rowIndex} className="rounded-md border border-rose-400/40 bg-rose-500/10 p-2">
              <p className="mb-1 text-xs font-semibold text-rose-100">
                Linha {entry.rowIndex + 1}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {entry.missingFields.map((field) => (
                  <span
                    key={`${entry.rowIndex}-${field}`}
                    className="rounded-full border border-amber-300/70 bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-100"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        {hiddenRowsCount > 0 && (
          <p className="text-[11px] font-medium text-rose-200/90">
            +{hiddenRowsCount} linha(s) com campos pendentes.
          </p>
        )}
        <p className="text-[11px] text-rose-200/80 transition-colors group-hover:text-rose-100">
          Clique em qualquer lugar deste aviso para fechar.
        </p>
      </div>
    </button>
  ), {
    id: toastId,
    duration: 8000,
    closeButton: false,
    className: "!p-0 !border-none !bg-transparent !shadow-none",
  });
}

export function TransactionForm({
  accounts,
  categories,
  onSave,
  onAddCategory,
  initialData,
  onDirtyChange,
}: TransactionFormProps) {
  const [rows, setRows] = useState<RowDraft[]>([emptyRow()]);
  const [initialRows, setInitialRows] = useState<RowDraft[]>([emptyRow()]);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addCatDialog, setAddCatDialog] = useState<{
    open: boolean;
    rowIndex: number;
    type: TransactionType;
  }>({ open: false, rowIndex: 0, type: "expense" });
  const [pendingCategorySelect, setPendingCategorySelect] = useState<{
    rowIndex: number;
    categoryName: string;
    subName: string;
    type: TransactionType;
  } | null>(null);

  useEffect(() => {
    if (!pendingCategorySelect) return;
    const { rowIndex, categoryName, subName, type } = pendingCategorySelect;
    const cat = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase() && c.type === type,
    );
    if (!cat) return;
    const sub = subName
      ? cat.subcategories.find((s) => s.name.toLowerCase() === subName.toLowerCase())
      : undefined;
    setRows((prev) =>
      prev.map((r, idx) =>
        idx === rowIndex ? { ...r, categoryId: cat.id, subcategoryId: sub?.id ?? "" } : r,
      ),
    );
    setPendingCategorySelect(null);
  }, [categories, pendingCategorySelect]);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      const nextRows = [{
        type: initialData.type,
        accountId: initialData.accountId,
        date: new Date(initialData.date + "T12:00:00"),
        description: initialData.description,
        amount: String(initialData.amount),
        categoryId: initialData.categoryId,
        subcategoryId: initialData.subcategoryId,
        installmentEnabled: initialData.isInstallment,
        installmentCount: initialData.installmentTotal
          ? String(initialData.installmentTotal)
          : "2",
      }];
      setRows(nextRows);
      setInitialRows(nextRows);
      return;
    }
    const nextRows = [emptyRow()];
    setRows(nextRows);
    setInitialRows(nextRows);
  }, [initialData]);

  useEffect(() => {
    const normalizeRows = (rowsToNormalize: RowDraft[]) =>
      rowsToNormalize.map((row) => ({
        type: row.type,
        accountId: row.accountId.trim(),
        date: row.date ? format(row.date, "yyyy-MM-dd") : "",
        description: row.description.trim(),
        amount: row.amount.trim(),
        categoryId: row.categoryId.trim(),
        subcategoryId: row.subcategoryId.trim(),
        installmentEnabled: row.installmentEnabled,
        installmentCount: row.installmentEnabled
          ? row.installmentCount.trim()
          : "",
      }));

    const hasChanges =
      JSON.stringify(normalizeRows(rows)) !==
      JSON.stringify(normalizeRows(initialRows));

    onDirtyChange?.(hasChanges);
  }, [initialRows, onDirtyChange, rows]);

  useEffect(() => {
    setActiveRowIndex((currentIndex) => {
      if (rows.length === 0) return 0;
      return Math.min(currentIndex, rows.length - 1);
    });
  }, [rows.length]);

  const updateRow = (i: number, patch: Partial<RowDraft>) => {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  const handleCategoryChange = (rowIndex: number, value: string) => {
    if (value === "__new__") {
      handleOpenAddCategory(rowIndex);
      return;
    }
    updateRow(rowIndex, { categoryId: value, subcategoryId: "" });
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

  const handleOpenAddCategory = (rowIndex: number) => {
    const row = rows[rowIndex];
    setAddCatDialog({
      open: true,
      rowIndex,
      type: row?.type ?? "expense",
    });
  };

  const handleInstallmentToggle = (rowIndex: number, enabled: boolean) => {
    updateRow(rowIndex, {
      installmentEnabled: enabled,
      installmentCount: enabled ? "2" : "2",
    });
  };

  const handleSubmit = async () => {
    const missingByRow = rows
      .map((row, index) => {
        const missingFields: string[] = [];

        if (!row.accountId.trim()) missingFields.push("Conta");
        if (!row.description.trim()) missingFields.push("Descrição");
        if (!row.amount.trim()) missingFields.push("Valor");
        if (!row.categoryId.trim()) missingFields.push("Categoria");
        if (!row.subcategoryId.trim()) missingFields.push("Subcategoria");
        if (row.installmentEnabled) {
          const installmentCount = Number.parseInt(row.installmentCount, 10);
          if (
            !row.installmentCount.trim() ||
            Number.isNaN(installmentCount) ||
            installmentCount < 2
          ) {
            missingFields.push("Parcelas");
          }
        }

        return {
          rowIndex: index,
          missingFields,
        };
      })
      .filter((entry) => entry.missingFields.length > 0);

    if (missingByRow.length > 0) {
      showMissingFieldsToast(missingByRow);
      return;
    }

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
        installmentEnabled: r.installmentEnabled,
        installmentCount: r.installmentEnabled
          ? Number.parseInt(r.installmentCount, 10)
          : undefined,
      }));
      const wasSaved = await onSave(drafts);
      if (wasSaved && !isEditing) {
        const nextRows = [emptyRow()];
        setRows(nextRows);
        setInitialRows(nextRows);
        setActiveRowIndex(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Column headers */}
      {!isEditing && (
        <div className="grid grid-cols-[64px_1fr_110px_1fr_96px_1fr_1fr_168px_32px] gap-2 px-1">
          <span className="text-sm text-muted-foreground">Tipo</span>
          <span className="text-sm text-muted-foreground">Conta</span>
          <span className="text-sm text-muted-foreground">Data</span>
          <span className="text-sm text-muted-foreground">Descrição</span>
          <span className="text-sm text-muted-foreground">Valor</span>
          <span className="text-sm text-muted-foreground">Categoria</span>
          <span className="text-sm text-muted-foreground">Subcategoria</span>
          <span className="text-sm text-muted-foreground">Parcelamento</span>
          <span />
        </div>
      )}

      <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Categoria e subcategoria da linha {activeRowIndex + 1}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => handleOpenAddCategory(activeRowIndex)}
        >
          <Plus className="h-3.5 w-3.5" />
          Nova categoria/subcategoria
        </Button>
      </div>

      <div className="space-y-2">
        {rows.map((row, i) => {
          const selectedCategory = categories.find((c) => c.id === row.categoryId);
          const filteredCategories = categories.filter((c) => c.type === row.type);

          if (isEditing) {
            return (
              <div
                key={i}
                className="space-y-4"
                onFocusCapture={() => setActiveRowIndex(i)}
                onPointerDownCapture={() => setActiveRowIndex(i)}
              >
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
                  <Select value={row.categoryId} onValueChange={(v) => handleCategoryChange(i, v)}>
                    <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__new__">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Plus className="h-3 w-3" />
                          Nova categoria
                        </span>
                      </SelectItem>
                      <SelectSeparator />
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
            <div
              key={i}
              className="grid grid-cols-[64px_1fr_110px_1fr_96px_1fr_1fr_168px_32px] gap-2 items-center"
              onFocusCapture={() => setActiveRowIndex(i)}
              onPointerDownCapture={() => setActiveRowIndex(i)}
            >
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
              <Select value={row.categoryId} onValueChange={(v) => handleCategoryChange(i, v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__new__">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Plus className="h-3 w-3" />
                      Nova categoria
                    </span>
                  </SelectItem>
                  <SelectSeparator />
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    "h-9 rounded-md border px-2 text-xs font-medium transition-colors",
                    row.installmentEnabled
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => handleInstallmentToggle(i, !row.installmentEnabled)}
                >
                  Parcelar
                </button>
                <Input
                  className="h-9 w-16 text-center text-sm"
                  type="number"
                  min={2}
                  value={row.installmentCount}
                  disabled={!row.installmentEnabled}
                  onChange={(event) =>
                    updateRow(i, { installmentCount: event.target.value })
                  }
                />
              </div>

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

      <AddCategoryDialog
        open={addCatDialog.open}
        defaultType={addCatDialog.type}
        categories={categories}
        onClose={() => setAddCatDialog((s) => ({ ...s, open: false }))}
        onAdd={onAddCategory}
        onCreated={(name, subName, type) => {
          setPendingCategorySelect({ rowIndex: addCatDialog.rowIndex, categoryName: name, subName, type });
        }}
      />
    </div>
  );
}
