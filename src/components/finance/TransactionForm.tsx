import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, Transaction, accounts } from "@/data/mockData";
import { Plus } from "lucide-react";
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
  categories: Category[];
  onAdd: (t: Omit<Transaction, "id">) => void;
}

export function TransactionForm({ categories, onAdd }: TransactionFormProps) {
  const [account, setAccount] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = () => {
    if (!account || !description || !amount || !categoryId || !subcategoryId) return;
    onAdd({
      account,
      date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      description,
      amount: parseFloat(amount),
      type,
      categoryId,
      subcategoryId,
    });
    setDescription("");
    setAmount("");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Nova Transação</h3>

      {/* Type toggle */}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Account */}
        <Select value={account} onValueChange={setAccount}>
          <SelectTrigger>
            <SelectValue placeholder="Conta" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date */}
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

        {/* Description */}
        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Amount */}
        <Input
          placeholder="R$ 0,00"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        {/* Category */}
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubcategoryId(""); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subcategory */}
        <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={!selectedCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {selectedCategory?.subcategories.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} className="gap-1">
          <Plus className="h-4 w-4" />
          Adicionar Transação
        </Button>
      </div>
    </div>
  );
}
