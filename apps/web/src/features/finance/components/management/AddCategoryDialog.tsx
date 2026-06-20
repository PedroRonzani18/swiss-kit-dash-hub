import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MutationResult } from '@/features/finance/types';
import type { Category, TransactionType } from '@/types/finance';
import { toast } from 'sonner';

interface AddCategoryDialogProps {
  open: boolean;
  defaultType: TransactionType;
  categories: Category[];
  onClose: () => void;
  onAdd: (name: string, subName: string, type: TransactionType) => Promise<MutationResult>;
  onCreated: (name: string, subName: string, type: TransactionType) => void;
}

type Mode = 'new' | 'existing';

export function AddCategoryDialog({
  open,
  defaultType,
  categories,
  onClose,
  onAdd,
  onCreated,
}: AddCategoryDialogProps) {
  const [mode, setMode] = useState<Mode>('new');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [catName, setCatName] = useState('');
  const [existingCatId, setExistingCatId] = useState('');
  const [subName, setSubName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMode('new');
      setType(defaultType);
      setCatName('');
      setExistingCatId('');
      setSubName('');
    }
  }, [open, defaultType]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const isValid =
    mode === 'new'
      ? catName.trim().length > 0
      : existingCatId.length > 0 && subName.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      let resolvedName: string;
      if (mode === 'existing') {
        const cat = categories.find((c) => c.id === existingCatId);
        if (!cat) return;
        resolvedName = cat.name;
      } else {
        resolvedName = catName.trim();
      }

      const result = await onAdd(resolvedName, subName.trim(), type);
      if (result === 'duplicate') {
        toast.error('Subcategoria já existe nessa categoria');
        return;
      }
      onCreated(resolvedName, subName.trim(), type);
      onClose();
    } catch {
      toast.error('Erro ao criar categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova categoria ou subcategoria</DialogTitle>
          <DialogDescription>
            Crie uma categoria com subcategoria ou adicione uma subcategoria em uma categoria existente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Criar categoria</TabsTrigger>
              <TabsTrigger value="existing">Adicionar em existente</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Type */}
          <Select value={type} onValueChange={(v) => { setType(v as TransactionType); setExistingCatId(''); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receita</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
            </SelectContent>
          </Select>

          {/* Category — new name or existing select */}
          {mode === 'new' ? (
            <Input
              placeholder="Nome da categoria"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          ) : (
            <Select value={existingCatId} onValueChange={setExistingCatId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length === 0 ? (
                  <div className="py-2 px-3 text-sm text-muted-foreground">
                    Nenhuma categoria
                  </div>
                ) : (
                  filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}

          {/* Subcategory */}
          <Input
            placeholder={mode === 'new' ? 'Subcategoria (opcional)' : 'Nome da subcategoria'}
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
