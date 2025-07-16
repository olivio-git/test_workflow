import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';

interface SubcategoryInputProps {
  categoryId: number;
  onSubmit: (categoryId: number, subcategoria: string) => Promise<void>;
  isLoading?: boolean;
}

export const SubcategoryInput = ({ categoryId, onSubmit, isLoading }: SubcategoryInputProps) => {
  const [subcategoria, setSubcategoria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subcategoria.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(categoryId, subcategoria.trim());
      setSubcategoria('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Input
        value={subcategoria}
        onChange={(e) => setSubcategoria(e.target.value)}
        placeholder="Nueva subcategoría..."
        className="h-8 text-sm"
        disabled={isLoading || isSubmitting}
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!subcategoria.trim() || isLoading || isSubmitting}
        className="h-8"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};