import { Button } from '@/components/atoms/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/atoms/context-menu';
import { ScrollArea, ScrollBar } from '@/components/atoms/scroll-area';
import { TooltipWrapper } from '@/components/common/TooltipWrapper';
import { useTabStore, type Tab } from '@/states/tabStore';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TabBarProps {
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const { tabs, activeTabId, setActiveTab, removeTab, closeOtherTabs, closeAllTabs } = useTabStore();

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  const handleNewTab = () => {
    // Por defecto, abrir el dashboard
    const dashboardPath = '/dashboard';
    navigate(dashboardPath);
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center border-b border-gray-200 bg-white', className)}>
      <ScrollArea className="flex-1">
        <div className="flex items-center gap-1 px-2 py-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const IconComponent = tab.icon;

            return (
              <ContextMenu key={tab.id}>
                <ContextMenuTrigger>
                  <TooltipWrapper tooltip={tab.path}>
                    <button
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        'group relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        'hover:bg-gray-100',
                        'min-w-[120px] max-w-[200px]',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate flex-1 text-left">
                        {tab.title}
                      </span>
                      <button
                        onClick={(e) => handleCloseTab(e, tab.id)}
                        className={cn(
                          'flex-shrink-0 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-gray-200 p-0.5 transition-opacity',
                          isActive && 'opacity-100'
                        )}
                        aria-label="Cerrar pestaña"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  </TooltipWrapper>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleCloseTab({} as React.MouseEvent, tab.id)}>
                    Cerrar
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => closeOtherTabs(tab.id)}>
                    Cerrar otras pestañas
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => closeAllTabs()}>
                    Cerrar todas las pestañas
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex-shrink-0 border-l border-gray-200 px-2">
        <TooltipWrapper tooltip="Nueva pestaña (Ctrl+T)">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewTab}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default TabBar;
