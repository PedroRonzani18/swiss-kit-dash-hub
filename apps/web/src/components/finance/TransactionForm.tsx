import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountOption, Category, Transaction } from "@/types/finance";
import { Plus, Save } from "lucide-react";
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

interface TransactionFormProps {
  accounts: AccountOption[];
  categories: Category[];
  onSave: (t: Omit<Transaction, "id" | "accountName">) => Promise<void>;
  initialData?: Transaction;
}

export function TransactionForm({
  accounts,
  categories,
  onSave,
  initialData,
}: TransactionFormProps) {
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAccountId(initialData.accountId);
      setDate(new Date(initialData.date + "T12:00:00"));
      setDescription(initialData.description);
      setAmount(String(initialData.amount));
      setType(initialData.type);
      setCategoryId(initialData.categoryId);
      setSubcategoryId(initialData.subcategoryId);
      return;
    }

    setAccountId("");
    setDate(undefined);
    setDescription("");
    setAmount("");
    setType("expense");
    setCategoryId("");
    setSubcategoryId("");
  }, [initialData]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const filteredCategories = categories.filter((c) => c.type === type);
  const isEditing = !!initialData;

  const handleSubmit = async () => {
    if (!accountId || !description || !amount || !categoryId || !subcategoryId) return;
    setIsSubmitting(true);
    try {
      await onSave({
        accountId,
        date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        description,
        amount: parseFloat(amount),
        type,
        categoryId,
        subcategoryId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-secondary rounded-md p-1 w-fit">
        <button
          onClick={() => { setType("income"); setCategoryId(""); setSubcategoryId(""); }}
          className={cn(
            "px-3 py-1 text-xs rounded transition-colors font-medium",
            type === "income" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Receita
        </button>
        <button
          onClick={() => { setType("expense"); setCategoryId(""); setSubcategoryId(""); }}
          className={cn(
            "px-3 py-1 text-xs rounded transition-colors font-medium",
            type === "expense" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Despesa
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger>
            <SelectValue placeholder="Conta" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>{account.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : "Hoje"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          placeholder="R$ 0,00"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubcategoryId(""); }}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={!selectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {selectedCategory?.subcategories.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} className="w-full gap-1" disabled={isSubmitting}>
        {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {isSubmitting
          ? "Salvando..."
          : isEditing
            ? "Salvar Alterações"
            : "Adicionar Transação"}
      </Button>
    </div>
  );
}
