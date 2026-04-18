import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import type { AnalyticsTypeFilter } from "@/features/finance/model/analytics";
import type { Category } from "@/types/finance";

type AnalyticsFiltersProps = {
  selectedYears: number[];
  selectedMonths: number[];
  selectedCategoryIds: string[];
  typeFilter: AnalyticsTypeFilter;
  availableYears: number[];
  availableMonths: number[];
  categories: Category[];
  setTypeFilter: (value: AnalyticsTypeFilter) => void;
  toggleYear: (year: number) => void;
  toggleMonth: (month: number) => void;
  toggleCategory: (categoryId: string) => void;
  selectAllMonths: () => void;
  clearMonths: () => void;
  selectAllCategories: () => void;
  clearCategories: () => void;
  monthNames: readonly string[];
};

export function AnalyticsFilters({
  selectedYears,
  selectedMonths,
  selectedCategoryIds,
  typeFilter,
  availableYears,
  availableMonths,
  categories,
  setTypeFilter,
  toggleYear,
  toggleMonth,
  toggleCategory,
  selectAllMonths,
  clearMonths,
  selectAllCategories,
  clearCategories,
  monthNames,
}: AnalyticsFiltersProps) {
  return (
    <Card>
      <CardContent className="pb-4 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Anos ({selectedYears.length})
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-3" align="start">
              <div className="space-y-2">
                {availableYears.map((year) => (
                  <label
                    key={year}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => toggleYear(year)}
                    />
                    {year}
                  </label>
                ))}
                {availableYears.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Sem anos com transações.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Meses ({selectedMonths.length})
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
              <div className="mb-2 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={selectAllMonths}
                >
                  Todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={clearMonths}
                >
                  Nenhum
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableMonths.map((month) => (
                  <label
                    key={month}
                    className="flex cursor-pointer items-center gap-1.5 text-xs"
                  >
                    <Checkbox
                      checked={selectedMonths.includes(month)}
                      onCheckedChange={() => toggleMonth(month)}
                    />
                    {monthNames[month]}
                  </label>
                ))}
                {availableMonths.length === 0 && (
                  <p className="col-span-3 text-xs text-muted-foreground">
                    Sem meses com transações.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Categorias ({selectedCategoryIds.length}/{categories.length})
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3" align="start">
              <div className="mb-2 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={selectAllCategories}
                >
                  Todas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={clearCategories}
                >
                  Nenhuma
                </Button>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <span>{category.name}</span>
                    <Badge
                      variant="outline"
                      className="ml-auto px-1.5 py-0 text-[10px]"
                    >
                      {category.type === "income" ? "Receita" : "Despesa"}
                    </Badge>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex gap-1 rounded-md bg-secondary p-1">
            {(["all", "income", "expense"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  typeFilter === value
                    ? "bg-status-success text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value === "all"
                  ? "Todos"
                  : value === "income"
                    ? "Receitas"
                    : "Despesas"}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
