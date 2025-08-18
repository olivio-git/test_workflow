import { useState } from "react";
import { deletePurchase } from "../services/purchaseService";
import { toast } from "@/hooks/use-toast";

export function usePurchaseDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<number | null>(null);

  const initiateDeletion = (purchaseId: number) => {
    setPurchaseToDelete(purchaseId);
    setShowDeleteDialog(true);
  };

  const cancelDeletion = () => {
    setPurchaseToDelete(null);
    setShowDeleteDialog(false);
  };

  const confirmDeletion = async (): Promise<boolean> => {
    if (!purchaseToDelete) return false;

    setIsDeleting(true);
    try {
      await deletePurchase(purchaseToDelete);
      toast({
        title: "Compra eliminada",
        description: "La compra se ha eliminado correctamente.",
      });
      
      setShowDeleteDialog(false);
      setPurchaseToDelete(null);
      return true;
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la compra. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    showDeleteDialog,
    purchaseToDelete,
    initiateDeletion,
    cancelDeletion,
    confirmDeletion,
  };
}
