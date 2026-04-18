import { useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import type { Category, TransactionType } from "@/types/finance";
import type { MutationResult } from "@/features/finance/types";

type DeleteTarget =
  | { type: "category"; id: string }
  | { type: "subcategory"; catId: string; subId: string }
  | null;

type UseCategoryManagerStateArgs = {
  categories: Category[];
  onAddCategory: (
    cat: string,
    sub: string,
    type: TransactionType,
  ) => Promise<MutationResult>;
  onAddSubcategory: (catId: string, subName: string) => Promise<MutationResult>;
  onUpdateCategory: (id: string, newName: string) => Promise<MutationResult>;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateSubcategory: (
    catId: string,
    subId: string,
    newName: string,
  ) => Promise<MutationResult>;
  onDeleteSubcategory: (catId: string, subId: string) => Promise<void>;
};

export function useCategoryManagerState({
  categories,
  onAddCategory,
  onAddSubcategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}: UseCategoryManagerStateArgs) {
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingSubKey, setEditingSubKey] = useState<string | null>(null);
  const [editingSubName, setEditingSubName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [addingSubCatId, setAddingSubCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  const handleAdd = async () => {
    if (!catName.trim() || !subName.trim()) {
      return;
    }

    try {
      const result = await onAddCategory(catName.trim(), subName.trim(), type);
      if (result === "duplicate") {
        toast.error("Esta subcategoria já existe nessa categoria");
      } else {
        toast.success("Categoria adicionada");
        setSubName("");
      }
    } catch {
      toast.error("Não foi possível adicionar a categoria");
    }
  };

  const startEditingCategory = (id: string, name: string) => {
    setEditingCatId(id);
    setEditingCatName(name);
  };

  const cancelEditingCategory = () => {
    setEditingCatId(null);
  };

  const saveCategory = async (id: string) => {
    if (!editingCatName.trim()) {
      return;
    }

    try {
      const result = await onUpdateCategory(id, editingCatName.trim());
      if (result === "duplicate") {
        toast.error("Esta categoria já existe");
      } else {
        toast.success("Categoria renomeada");
        setEditingCatId(null);
      }
    } catch {
      toast.error("Não foi possível renomear a categoria");
    }
  };

  const startEditingSubcategory = (catId: string, subId: string, name: string) => {
    setEditingSubKey(`${catId}:${subId}`);
    setEditingSubName(name);
  };

  const cancelEditingSubcategory = () => {
    setEditingSubKey(null);
  };

  const saveSubcategory = async (catId: string, subId: string) => {
    if (!editingSubName.trim()) {
      return;
    }

    try {
      const result = await onUpdateSubcategory(catId, subId, editingSubName.trim());
      if (result === "duplicate") {
        toast.error("Esta subcategoria já existe");
      } else {
        toast.success("Subcategoria renomeada");
        setEditingSubKey(null);
      }
    } catch {
      toast.error("Não foi possível renomear a subcategoria");
    }
  };

  const startAddingSub = (catId: string) => {
    setAddingSubCatId(catId);
    setNewSubName("");
  };

  const cancelAddingSub = () => {
    setAddingSubCatId(null);
    setNewSubName("");
  };

  const handleAddSub = async (catId: string) => {
    if (!newSubName.trim()) return;
    try {
      const result = await onAddSubcategory(catId, newSubName.trim());
      if (result === "duplicate") {
        toast.error("Esta subcategoria já existe nessa categoria");
      } else {
        toast.success("Subcategoria adicionada");
        setNewSubName("");
        setAddingSubCatId(null);
      }
    } catch {
      toast.error("Não foi possível adicionar a subcategoria");
    }
  };

  const requestDeleteCategory = (id: string) => {
    setDeleteTarget({ type: "category", id });
  };

  const requestDeleteSubcategory = (catId: string, subId: string) => {
    setDeleteTarget({ type: "subcategory", catId, subId });
  };

  const closeDeleteDialog = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.type === "category") {
        await onDeleteCategory(deleteTarget.id);
        toast.success("Categoria removida");
      } else {
        await onDeleteSubcategory(deleteTarget.catId, deleteTarget.subId);
        toast.success("Subcategoria removida");
      }
      setDeleteTarget(null);
    } catch {
      toast.error("Não foi possível excluir o item selecionado");
    }
  };

  return {
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
    addingSubCatId,
    newSubName,
    setNewSubName,
    handleAdd,
    startEditingCategory,
    cancelEditingCategory,
    saveCategory,
    startEditingSubcategory,
    cancelEditingSubcategory,
    saveSubcategory,
    startAddingSub,
    cancelAddingSub,
    handleAddSub,
    requestDeleteCategory,
    requestDeleteSubcategory,
    closeDeleteDialog,
    confirmDelete,
  };
}
