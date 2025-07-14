import { create } from 'zustand';
import { environment } from "@/utils/environment";

interface BranchState {
  selectedBranchId: string | null;
  setSelectedBranch: (branchId: string) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  selectedBranchId: localStorage.getItem(environment.branch_selected_key) || null,

  setSelectedBranch: (branchId) => {
    localStorage.setItem(environment.branch_selected_key, branchId);
    set({ selectedBranchId: branchId });
  },
}));