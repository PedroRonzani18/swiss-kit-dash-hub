import { useState, useMemo } from "react";
import { Transaction, Category } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Search } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  getCategoryName: (id: string) => string;
  getSubcategoryName: (catId: string, subId: string) => string;
}

export function TransactionTable({
  transactions,
  getCategoryName,
  getSubcategoryName,
}: TransactionTableProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = transactions.filter((t) =>
      t.description.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortAsc ? diff : -diff;
    });
    return result;
  }, [transactions, search, sortAsc]);

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className="animate-fade-in">
                <TableCell className="text-xs font-mono-code">{t.account}</TableCell>
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
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
