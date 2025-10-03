import { create } from 'zustand';
import { environment } from "@/utils/environment";

interface BranchState {
  selectedBranchId: string | null;
  setSelectedBranch: (branchId: string) => void;
}

// Helper seguro para leer de localStorage
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error leyendo branch storage:', error);
    return null;
  }
};

// Helper seguro para escribir en localStorage
const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error guardando branch storage:', error);
    // Si falla por quota, intentar limpiar
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        localStorage.clear();
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Error crítico con localStorage:', e);
      }
    }
  }
};

export const useBranchStore = create<BranchState>((set) => ({
  selectedBranchId: safeGetItem(environment.branch_selected_key),

  setSelectedBranch: (branchId) => {
    safeSetItem(environment.branch_selected_key, branchId);
    set({ selectedBranchId: branchId });
  },
}));