import { useTabStore } from '@/states/tabStore';
import { useEffect, useRef, type ReactNode } from 'react';

interface TabContentProps {
  children: ReactNode;
  tabId: string;
}

/**
 * Componente que preserva el contenido de cada tab
 * Usa display: none en lugar de unmount para mantener el estado
 */
const TabContent: React.FC<TabContentProps> = ({ children, tabId }) => {
  const { activeTabId, updateTab, getTab } = useTabStore();
  const isActive = tabId === activeTabId;
  const containerRef = useRef<HTMLDivElement>(null);

  // Guardar la posición del scroll cuando el tab se vuelve inactivo
  useEffect(() => {
    if (!isActive && containerRef.current) {
      const scrollPosition = containerRef.current.scrollTop;
      updateTab(tabId, { scrollPosition });
    }
  }, [isActive, tabId, updateTab]);

  // Restaurar la posición del scroll cuando el tab se activa
  useEffect(() => {
    if (isActive && containerRef.current) {
      const tab = getTab(tabId);
      if (tab?.scrollPosition) {
        containerRef.current.scrollTop = tab.scrollPosition;
      }
    }
  }, [isActive, tabId, getTab]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto"
      style={{
        display: isActive ? 'block' : 'none',
      }}
    >
      {children}
    </div>
  );
};

export default TabContent;
