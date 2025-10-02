import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  id: string;
  path: string;
  title: string;
  icon?: any;
  // Estado del scroll para cada tab
  scrollPosition?: number;
  // Metadata adicional que puedas necesitar
  metadata?: Record<string, any>;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;

  // Acciones
  addTab: (path: string, title: string, icon?: any) => string;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (tabId: string) => void;
  getTab: (tabId: string) => Tab | undefined;
  findTabByPath: (path: string) => Tab | undefined;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      addTab: (path: string, title: string, icon?: any) => {
        const state = get();

        // Verificar si ya existe un tab con esta ruta
        const existingTab = state.tabs.find(tab => tab.path === path);

        if (existingTab) {
          // Si existe, solo activarlo
          set({ activeTabId: existingTab.id });
          return existingTab.id;
        }

        // Crear nuevo tab
        const newTab: Tab = {
          id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          path,
          title,
          icon,
          scrollPosition: 0,
          metadata: {}
        };

        set(state => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id
        }));

        return newTab.id;
      },

      removeTab: (tabId: string) => {
        const state = get();
        const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);

        if (tabIndex === -1) return;

        const newTabs = state.tabs.filter(tab => tab.id !== tabId);

        // Si estamos cerrando el tab activo, activar otro
        let newActiveTabId = state.activeTabId;

        if (state.activeTabId === tabId) {
          if (newTabs.length > 0) {
            // Activar el tab anterior, o el siguiente si no hay anterior
            const newIndex = tabIndex > 0 ? tabIndex - 1 : 0;
            newActiveTabId = newTabs[newIndex]?.id || null;
          } else {
            newActiveTabId = null;
          }
        }

        set({
          tabs: newTabs,
          activeTabId: newActiveTabId
        });
      },

      setActiveTab: (tabId: string) => {
        const state = get();
        const tab = state.tabs.find(t => t.id === tabId);

        if (tab) {
          set({ activeTabId: tabId });
        }
      },

      updateTab: (tabId: string, updates: Partial<Tab>) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, ...updates }
              : tab
          )
        }));
      },

      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      },

      closeOtherTabs: (tabId: string) => {
        const state = get();
        const tab = state.tabs.find(t => t.id === tabId);

        if (tab) {
          set({
            tabs: [tab],
            activeTabId: tabId
          });
        }
      },

      getTab: (tabId: string) => {
        return get().tabs.find(tab => tab.id === tabId);
      },

      findTabByPath: (path: string) => {
        return get().tabs.find(tab => tab.path === path);
      },

      reorderTabs: (fromIndex: number, toIndex: number) => {
        set(state => {
          const newTabs = [...state.tabs];
          const [movedTab] = newTabs.splice(fromIndex, 1);
          newTabs.splice(toIndex, 0, movedTab);
          return { tabs: newTabs };
        });
      }
    }),
    {
      name: 'tab-storage',
      // Solo persistir las rutas, no el estado completo
      partialize: (state) => ({
        tabs: state.tabs.map(({ id, path, title, icon }) => ({
          id,
          path,
          title,
          icon
        })),
        activeTabId: state.activeTabId
      })
    }
  )
);
