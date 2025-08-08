import { useEffect, useRef, useState, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { ProductGet } from '../types/ProductGet';

interface UseKeyboardNavigationProps {
  products: ProductGet[];
  onAddToCart: (product: ProductGet) => void;
  onViewDetails: (productId: number) => void;
  onRemoveFromCart: () => void;
}

export const useKeyboardNavigation = ({
  products,
  onAddToCart,
  onViewDetails,
  onRemoveFromCart,
}: UseKeyboardNavigationProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isNavigatingWithinRow, setIsNavigatingWithinRow] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const tableRef = useRef<HTMLTableElement>(null);
  const selectedProduct = products[selectedIndex];

  useEffect(() => {
    if (!isFocused) return
    if (tableRef.current) {
      const selectedRow = tableRef.current.querySelector(
        `[data-row-index="${selectedIndex}"]`
      ) as HTMLElement | null;

      if (selectedRow) {
        selectedRow.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // mantiene el scroll lo más cerca posible sin saltar
        });
      }
    }
  }, [selectedIndex, isFocused]);
  // Resetear índice cuando cambien los productos
  useEffect(() => {
    if (products.length > 0 && selectedIndex >= products.length) {
      setSelectedIndex(0);
    }
  }, [products.length, selectedIndex]);

  // Función para obtener elementos focuseables en la fila seleccionada
  const getFocusableElementsInSelectedRow = useCallback((): HTMLElement[] => {
    if (!tableRef.current) return [];

    const selectedRow = tableRef.current.querySelector(`[data-row-index="${selectedIndex}"]`);
    if (!selectedRow) return [];

    const focusableElements = selectedRow.querySelectorAll(
      'button, input, textarea, select, a, [tabindex]:not([tabindex="-1"])'
    );

    return Array.from(focusableElements) as HTMLElement[];
  }, [selectedIndex]);

  // Función para verificar si debemos bloquear las hotkeys
  const isInRestrictedContext = (): boolean => {
    const activeElement = document.activeElement as HTMLElement;

    if (!activeElement) return false;

    // Bloquear si estamos en inputs, textareas, o elementos editables
    return (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true' ||
      activeElement.closest('[role="menu"]') !== null ||
      activeElement.closest('[data-radix-popper-content-wrapper]') !== null ||
      activeElement.closest('.dropdown-content') !== null
    );
  };

  // Activar navegación por teclado (siempre disponible)
  useHotkeys('alt+t', () => {
    setIsFocused(true);
    setIsNavigatingWithinRow(false);
    setCurrentElementIndex(-1);
    tableRef.current?.focus();
  });

  // Desactivar navegación por teclado
  useHotkeys('escape', () => {
    setIsFocused(false);
    setIsNavigatingWithinRow(false);
    setCurrentElementIndex(-1);
  }, {
    enabled: isFocused
  });

  // Navegación hacia arriba
  useHotkeys('up', () => {
    if (!isInRestrictedContext() && isFocused) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
      setIsNavigatingWithinRow(false);
      setCurrentElementIndex(-1);
    }
  }, {
    enableOnFormTags: false,
    preventDefault: true
  });

  // Navegación hacia abajo
  useHotkeys('down', () => {
    if (!isInRestrictedContext() && isFocused) {
      setSelectedIndex(prev => Math.min(products.length - 1, prev + 1));
      setIsNavigatingWithinRow(false);
      setCurrentElementIndex(-1);
    }
  }, {
    enableOnFormTags: false,
    preventDefault: true
  });

  // TAB - Navegar elementos dentro de la fila seleccionada
  useHotkeys('tab', (e) => {
    if (!isInRestrictedContext() && isFocused) {
      e.preventDefault();

      const focusableElements = getFocusableElementsInSelectedRow();

      if (focusableElements.length === 0) return;

      if (!isNavigatingWithinRow) {
        // Primera vez presionando Tab - enfocar primer elemento
        setIsNavigatingWithinRow(true);
        setCurrentElementIndex(0);
        focusableElements[0].focus();
      } else {
        // Ya estamos navegando dentro de la fila
        if (e.shiftKey) {
          // Shift+Tab - ir hacia atrás
          const newIndex = currentElementIndex - 1;
          if (newIndex >= 0) {
            setCurrentElementIndex(newIndex);
            focusableElements[newIndex].focus();
          } else {
            // Salir del modo navegación dentro de fila
            setIsNavigatingWithinRow(false);
            setCurrentElementIndex(-1);
            tableRef.current?.focus();
          }
        } else {
          // Tab - ir hacia adelante
          const newIndex = currentElementIndex + 1;
          if (newIndex < focusableElements.length) {
            setCurrentElementIndex(newIndex);
            focusableElements[newIndex].focus();
          } else {
            // Salir del modo navegación dentro de fila
            setIsNavigatingWithinRow(false);
            setCurrentElementIndex(-1);
            tableRef.current?.focus();
          }
        }
      }
    }
  }, {
    enableOnFormTags: true,
    preventDefault: false
  });

  // Ver detalles (solo si no estamos navegando dentro de fila)
  useHotkeys('enter', () => {
    if (!isInRestrictedContext() && isFocused && !isNavigatingWithinRow && selectedProduct) {
      onViewDetails(selectedProduct.id);
    }
  }, {
    enableOnFormTags: false,
    preventDefault: true
  });

  // Agregar al carrito
  useHotkeys(['insert', 'plus'], () => {
    if (!isInRestrictedContext() && isFocused && selectedProduct) {
      onAddToCart(selectedProduct);
    }
  }, {
    enableOnFormTags: false,
    preventDefault: true
  });

  // Quitar del carrito
  useHotkeys(['delete', 'minus'], () => {
    if (!isInRestrictedContext() && isFocused) {
      onRemoveFromCart();
    }
  }, {
    enableOnFormTags: false,
    preventDefault: true
  });

  // Resetear navegación dentro de fila cuando cambia la fila seleccionada
  useEffect(() => {
    setIsNavigatingWithinRow(false);
    setCurrentElementIndex(-1);
  }, [selectedIndex]);

  // Manejar clics para activar/desactivar foco
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (tableRef.current && tableRef.current.contains(target)) {
        // Clic dentro de la tabla
        setIsFocused(true);

        // Si hicimos clic en un elemento dentro de una fila, actualizar selectedIndex
        const clickedRow = target.closest('[data-row-index]') as HTMLElement;
        if (clickedRow) {
          const rowIndex = parseInt(clickedRow.getAttribute('data-row-index') || '0');
          setSelectedIndex(rowIndex);
        }

        // Si hicimos clic en un elemento focuseable, entrar en modo navegación dentro de fila
        const focusableElement = target.closest('button, input, textarea, select, a') as HTMLElement;
        if (focusableElement && clickedRow) {
          const focusableElements = getFocusableElementsInSelectedRow();
          const elementIndex = focusableElements.indexOf(focusableElement);
          if (elementIndex !== -1) {
            setIsNavigatingWithinRow(true);
            setCurrentElementIndex(elementIndex);
          }
        }
      } else {
        // Clic fuera de la tabla
        setIsFocused(false);
        setIsNavigatingWithinRow(false);
        setCurrentElementIndex(-1);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [getFocusableElementsInSelectedRow]);

  const handleTableClick = () => {
    setIsFocused(true);
  };

  return {
    selectedIndex,
    selectedProduct,
    setSelectedIndex,
    isFocused,
    setIsFocused,
    tableRef,
    handleTableClick
  };
};