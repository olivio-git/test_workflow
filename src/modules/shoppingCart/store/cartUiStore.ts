import { create } from "zustand"

interface CartUiState {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

export const useCartUiStore = create<CartUiState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
