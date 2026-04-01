import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, TransactionType } from "@/data/mockData";
import { Plus, ChevronRight, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (cat: string, sub: string, type: TransactionType) => void;
}

export function CategoryManager({ categories, onAddCategory }: CategoryManagerProps) {
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  const handleAdd = () => {
    if (!catName.trim() || !subName.trim()) return;
    onAddCategory(catName.trim(), subName.trim(), type);
    setSubName("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Categorias & Subcategorias
      </h3>
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Categoria"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          className="w-40"
        />
        <Input
          placeholder="Subcategoria"
          value={subName}
          onChange={(e) => setSubName(e.target.value)}
          className="w-40"
        />
        <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Receita</SelectItem>
            <SelectItem value="expense">Despesa</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} size="sm" className="gap-1">
          <Plus className="h-3 w-3" />
          Adicionar
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border rounded-lg p-3 text-sm animate-fade-in"
          >
            <div className="font-medium text-card-foreground flex items-center justify-between">
              {cat.name}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${
                  cat.type === "income"
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {cat.type === "income" ? "receita" : "despesa"}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {cat.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="text-muted-foreground flex items-center gap-1 text-xs"
                >
                  <ChevronRight className="h-3 w-3" />
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
