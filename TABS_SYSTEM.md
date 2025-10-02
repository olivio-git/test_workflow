# Sistema de Pestañas (Tabs) - Documentación

## 🎯 Descripción

El sistema de pestañas permite a los usuarios abrir múltiples vistas de la aplicación simultáneamente, cada una manteniendo su propio estado independiente. Esto facilita tareas como:

- Crear una venta mientras se consulta un producto
- Editar múltiples registros sin perder el progreso
- Comparar información de diferentes secciones
- Mantener formularios incompletos sin perder los datos

## 📋 Características

### ✅ Estado Preservado
Cada pestaña mantiene:
- Estado de formularios
- Posición del scroll
- Filtros aplicados
- Datos cargados

### ✅ Navegación Intuitiva
- Click en el sidebar abre/activa pestañas automáticamente
- Tabs con iconos y títulos descriptivos
- Botón "+" para crear nuevas pestañas
- Menú contextual (click derecho) en cada tab

### ✅ Atajos de Teclado
- `Ctrl + T`: Nueva pestaña (dashboard)
- `Ctrl + W`: Cerrar pestaña actual
- `Ctrl + Tab`: Siguiente pestaña
- `Ctrl + Shift + Tab`: Pestaña anterior

## 🏗️ Arquitectura

### 1. **Store de Estado** (`src/states/tabStore.ts`)
Maneja el estado global de todas las pestañas:
```typescript
interface Tab {
  id: string;
  path: string;
  title: string;
  icon?: any;
  scrollPosition?: number;
  metadata?: Record<string, any>;
}
```

### 2. **Hook de Navegación** (`src/hooks/useTabNavigation.ts`)
Proporciona funciones para navegar y manipular tabs:
```typescript
const {
  navigateWithTab,  // Navegar creando/activando tab
  nextTab,          // Ir al siguiente tab
  previousTab,      // Ir al tab anterior
  closeCurrentTab,  // Cerrar tab actual
  currentTab,       // Tab actualmente activo
  tabs             // Todos los tabs
} = useTabNavigation();
```

### 3. **Componentes**

#### `TabBar` (`src/components/tabs/TabBar.tsx`)
Barra horizontal que muestra todas las pestañas abiertas.

#### `TabContainer` (`src/components/tabs/TabContainer.tsx`)
Contenedor que renderiza todas las vistas de tabs, manteniendo sus estados.

#### `TabContent` (`src/components/tabs/TabContent.tsx`)
Wrapper que preserva el contenido y scroll de cada tab usando `display: none` en lugar de unmount.

## 🚀 Uso

### Navegación Automática
El sistema detecta automáticamente cuando el usuario navega y crea/activa tabs:

```typescript
// En el sidebar o cualquier Link de react-router
<Link to="/purchases/create">Crear Compra</Link>
// ✅ Automáticamente crea o activa el tab de "Crear Compra"
```

### Navegación Programática
Para abrir una ruta en un nuevo tab o controlar la navegación:

```typescript
import { useTabNavigation } from '@/hooks/useTabNavigation';

const MyComponent = () => {
  const { navigateWithTab } = useTabNavigation();

  const handleOpenInNewTab = () => {
    navigateWithTab('/products/123', { newTab: true });
  };

  return (
    <button onClick={handleOpenInNewTab}>
      Abrir en nueva pestaña
    </button>
  );
};
```

### Acceso al Store Directamente
```typescript
import { useTabStore } from '@/states/tabStore';

const MyComponent = () => {
  const { tabs, activeTabId, addTab, removeTab } = useTabStore();

  // Manipular tabs manualmente si es necesario
};
```

## 📝 Menú Contextual

Click derecho en cualquier tab para acceder a:
- **Cerrar**: Cierra la pestaña actual
- **Cerrar otras pestañas**: Cierra todas excepto la seleccionada
- **Cerrar todas las pestañas**: Cierra todas las pestañas

## 💾 Persistencia

El sistema guarda automáticamente en `localStorage`:
- Lista de tabs abiertos
- Tab activo
- Rutas de cada tab

Al recargar la aplicación, las pestañas se restauran automáticamente.

## 🎨 UI/UX

### Diseño Visual
- Tab activo: Fondo gris claro con línea azul inferior
- Tab inactivo: Texto gris, hover para cambiar color
- Icono de cerrar (X) visible en hover o tab activo
- Scroll horizontal si hay muchos tabs
- Tooltip muestra la ruta completa en hover

### Límites
- Ancho mínimo: 120px por tab
- Ancho máximo: 200px por tab
- Título truncado con ellipsis (...)

## 🔧 Personalización

### Agregar Metadata Custom a un Tab
```typescript
const { updateTab } = useTabStore();

updateTab(tabId, {
  metadata: {
    formData: { /* datos del formulario */ },
    lastSaved: new Date(),
    isDirty: true
  }
});
```

### Interceptar Cierre de Tab
Puedes agregar lógica en `TabBar.tsx` para preguntar antes de cerrar:
```typescript
const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
  e.stopPropagation();

  const tab = getTab(tabId);
  if (tab?.metadata?.isDirty) {
    if (!confirm('¿Cerrar sin guardar?')) return;
  }

  removeTab(tabId);
};
```

## 🐛 Troubleshooting

### Los tabs no se crean automáticamente
- Verifica que la ruta esté definida en `protectedRoutes`
- Asegúrate de que `useTabNavigation` se esté usando en el Layout

### El estado se pierde al cambiar de tab
- Verifica que `TabContent` use `display: none` no unmount
- Revisa que `TabContainer` renderice todos los tabs, no solo el activo

### Los atajos de teclado no funcionan
- Verifica que no haya conflictos con otros atajos
- Asegúrate de que `react-hotkeys-hook` esté instalado

## 🚦 Próximas Mejoras

- [ ] Drag & drop para reordenar tabs
- [ ] Indicador visual de tabs "sucios" (con cambios sin guardar)
- [ ] Límite máximo de tabs abiertos
- [ ] Búsqueda de tabs (si hay muchos abiertos)
- [ ] Guardar grupos de tabs como "espacios de trabajo"
- [ ] Integración con Tauri para ventanas nativas (fase 2)

## 📚 Referencias

- Store: [src/states/tabStore.ts](src/states/tabStore.ts)
- Hook: [src/hooks/useTabNavigation.ts](src/hooks/useTabNavigation.ts)
- Componentes: [src/components/tabs/](src/components/tabs/)
- Layout: [src/modules/dashboard/screens/layout.tsx](src/modules/dashboard/screens/layout.tsx)
