import { useCategoryManagerState } from "@/features/finance/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, TransactionType } from "@/types/finance";
import { Plus, ChevronRight, Tag, Pencil, Trash2, Check, X } from "lucide-react";
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

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (
    cat: string,
    sub: string,
    type: TransactionType,
  ) => Promise<"duplicate" | "success">;
  onUpdateCategory: (
    id: string,
    newName: string,
  ) => Promise<"duplicate" | "success">;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateSubcategory: (
    catId: string,
    subId: string,
    newName: string,
  ) => Promise<"duplicate" | "success">;
  onDeleteSubcategory: (catId: string, subId: string) => Promise<void>;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}: CategoryManagerProps) {
  const {
    catName,
    setCatName,
    subName,
    setSubName,
    type,
    setType,
    sortedCategories,
    editingCatId,
    editingCatName,
    setEditingCatName,
    editingSubKey,
    editingSubName,
    setEditingSubName,
    deleteTarget,
    handleAdd,
    startEditingCategory,
    cancelEditingCategory,
    saveCategory,
    startEditingSubcategory,
    cancelEditingSubcategory,
    saveSubcategory,
    requestDeleteCategory,
    requestDeleteSubcategory,
    closeDeleteDialog,
    confirmDelete,
  } = useCategoryManagerState({
    categories,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    onUpdateSubcategory,
    onDeleteSubcategory,
  });

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
        {sortedCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border rounded-lg p-3 text-sm animate-fade-in group/card"
          >
            <div className="font-medium text-card-foreground flex items-center justify-between">
              {editingCatId === cat.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    value={editingCatName}
                    onChange={(e) => setEditingCatName(e.target.value)}
                    className="h-7 text-sm"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveCategory(cat.id)}
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => saveCategory(cat.id)}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={cancelEditingCategory}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    {cat.name}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${
                        cat.type === "income"
                          ? "bg-status-success/15 text-status-success"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {cat.type === "income" ? "receita" : "despesa"}
                    </span>
                  </span>
                  <div className="flex gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => startEditingCategory(cat.id, cat.name)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => requestDeleteCategory(cat.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {[...cat.subcategories].sort((a, b) => a.name.localeCompare(b.name)).map((sub) => {
                const subKey = `${cat.id}:${sub.id}`;
                return (
                  <div
                    key={sub.id}
                    className="text-muted-foreground flex items-center gap-1 text-sm group/sub"
                  >
                    {editingSubKey === subKey ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          value={editingSubName}
                          onChange={(e) => setEditingSubName(e.target.value)}
                          className="h-6 text-xs"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && saveSubcategory(cat.id, sub.id)}
                        />
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => saveSubcategory(cat.id, sub.id)}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={cancelEditingSubcategory}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        <span className="flex-1">{sub.name}</span>
                        <div className="flex gap-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() =>
                              startEditingSubcategory(cat.id, sub.id, sub.name)
                            }
                          >
                            <Pencil className="h-2.5 w-2.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive"
                            onClick={() =>
                              requestDeleteSubcategory(cat.id, sub.id)
                            }
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir {deleteTarget?.type === "category" ? "categoria" : "subcategoria"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "category"
                ? "Todas as subcategorias e transações relacionadas serão removidas."
                : "As transações relacionadas serão removidas."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
