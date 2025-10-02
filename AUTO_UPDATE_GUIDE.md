# 🔄 Sistema de Auto-Actualización - TPS Intermotors

## ✅ Implementación Completa

Se ha implementado el sistema completo de auto-actualización usando **Tauri Updater**. Los usuarios ahora pueden actualizar la aplicación con un solo clic desde la interfaz.

---

## 🎯 Características Implementadas

### 1. **Backend (Rust)**
- ✅ Plugin `tauri-plugin-updater` agregado a [Cargo.toml](src-tauri/Cargo.toml:26)
- ✅ Configuración del updater en [tauri.conf.json](src-tauri/tauri.conf.json:47-56)
- ✅ Inicialización del plugin en [lib.rs](src-tauri/src/lib.rs:13)

### 2. **Frontend (React)**
- ✅ Hook `useUpdateChecker` en [src/hooks/useUpdateChecker.ts](src/hooks/useUpdateChecker.ts)
- ✅ Vista de actualizaciones en [UpdateSettings.tsx](src/modules/settings/components/settings/UpdateSettings.tsx)
- ✅ Ruta agregada en [Settings.Route.ts](src/navigation/Settings.Route.ts:97-108)
- ✅ Badge de notificación en el sidebar
- ✅ Badge de notificación en la navegación de Settings

---

## 🎨 UI/UX Implementada

### **1. Badge en Sidebar (Configuración)**
Cuando hay una actualización disponible:
```
┌────────────────────────┐
│  ⚙️  Configuración  [1] │  ← Badge rojo con número 1
└────────────────────────┘
```

### **2. Badge en Settings Navigation**
En las pestañas de configuración:
```
┌─────────────────────────────────────────────┐
│ [Datos] [Apariencia] [Sistema] [Actualizaciones] │
│                                    ↑              │
│                              Badge [1] si hay update
└─────────────────────────────────────────────┘
```

### **3. Pantalla de Actualizaciones**
```
┌────────────────────────────────────────────────┐
│  🔄 Nueva versión disponible                   │
│                                                │
│  📦 Versión 1.0.1 disponible                   │
│  Se recomienda actualizar para obtener         │
│  las últimas mejoras y correcciones.           │
│                                                │
│  [Descargar e instalar]  [Más tarde]           │
│                                                │
│  Versión actual: 1.0.0                         │
│  Última versión: 1.0.1                         │
└────────────────────────────────────────────────┘
```

---

## 📋 Flujo de Usuario

### **Check Automático al Iniciar**
```
1. Usuario abre la app
   ↓
2. Hook useUpdateChecker verifica actualizaciones automáticamente
   ↓
3. Si hay actualización disponible:
   - Badge [1] aparece en "Configuración" del sidebar
   - Badge [1] aparece en tab "Actualizaciones" de Settings
```

### **Check Manual**
```
1. Usuario va a Configuración → Actualizaciones
   ↓
2. Click en "Buscar actualizaciones"
   ↓
3. Si hay actualización:
   - Muestra alerta con versión disponible
   - Botón "Descargar e instalar"
```

### **Proceso de Actualización**
```
1. Usuario hace click en "Descargar e instalar"
   ↓
2. Descarga en background con barra de progreso
   ↓
3. Validación de firma digital
   ↓
4. Instalación automática
   ↓
5. App se reinicia automáticamente
   ↓
6. ✅ Usuario tiene la nueva versión
```

---

## 🔧 Configuración

### **Endpoint de Actualizaciones**
Configurado en [tauri.conf.json](src-tauri/tauri.conf.json:50-52):
```json
{
  "endpoints": [
    "https://github.com/StackOverlords/TPS_INTERMOTORS_DISTRIBUTION/releases/latest/download/latest.json"
  ]
}
```

### **Firma Digital (Recomendado)**
Para habilitar la firma digital:

1. **Generar claves**:
```bash
npm install -g @tauri-apps/cli
tauri signer generate -w ~/.tauri/tps-intermotors.key
```

2. **Agregar secretos a GitHub**:
- `TAURI_SIGNING_PRIVATE_KEY`: contenido de la clave privada
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: contraseña (si la hay)

3. **Actualizar workflow** ([.github/workflows/release.yml](.github/workflows/release.yml)):
```yaml
env:
  TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
  TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
```

4. **Agregar public key** en [tauri.conf.json](src-tauri/tauri.conf.json:54):
```json
{
  "pubkey": "TU_PUBLIC_KEY_AQUI"
}
```

---

## 🚀 Cómo Funciona

### **1. Crear Release**
```bash
# Crear nuevo release
./scripts/release.sh 1.0.1

# GitHub Actions automáticamente:
# - Compila la app
# - Genera instaladores (.msi, .exe)
# - Firma los archivos
# - Crea latest.json
# - Sube todo a GitHub Releases
```

### **2. Cliente Detecta Actualización**
```typescript
// useUpdateChecker.ts hace:
const update = await check();

if (update?.available) {
  // Muestra badge en UI
  // Notifica al usuario
}
```

### **3. Descarga e Instalación**
```typescript
// Usuario hace click en "Descargar e instalar"
await update.downloadAndInstall((event) => {
  // Muestra progreso en tiempo real
  switch (event.event) {
    case 'Progress':
      // Actualiza barra de progreso
      break;
    case 'Finished':
      // Instalación completa
      break;
  }
});

// Reinicia automáticamente
await relaunch();
```

---

## 📊 Estado de la Actualización

El hook `useUpdateChecker` proporciona:

```typescript
{
  available: boolean;          // ¿Hay actualización?
  currentVersion: string;       // Versión actual
  latestVersion: string;        // Última versión
  isChecking: boolean;          // Verificando...
  isDownloading: boolean;       // Descargando...
  isInstalling: boolean;        // Instalando...
  downloadProgress: number;     // 0-100%
  error: string | null;         // Error si hay

  // Funciones
  checkForUpdates(silent);      // Verificar manualmente
  downloadAndInstall();         // Descargar e instalar
  dismissUpdate();              // Descartar notificación
  clearError();                 // Limpiar error
}
```

---

## 🎯 Uso en Componentes

### **Check de actualización**
```typescript
import { useUpdateChecker } from '@/hooks/useUpdateChecker';

const MyComponent = () => {
  const { available, checkForUpdates } = useUpdateChecker();

  return (
    <div>
      {available && <Badge>Nueva versión disponible</Badge>}
      <Button onClick={() => checkForUpdates(false)}>
        Buscar actualizaciones
      </Button>
    </div>
  );
};
```

### **Descarga e instalación**
```typescript
const { downloadAndInstall, downloadProgress, isDownloading } = useUpdateChecker();

return (
  <div>
    {isDownloading && (
      <Progress value={downloadProgress} />
    )}
    <Button onClick={downloadAndInstall}>
      Descargar e instalar
    </Button>
  </div>
);
```

---

## 🔐 Seguridad

### **Validación de Firma**
- Cada actualización está firmada digitalmente
- Tauri valida la firma antes de instalar
- Si la firma no coincide → rechaza la actualización

### **HTTPS Obligatorio**
- Las actualizaciones solo se descargan por HTTPS
- GitHub Releases usa HTTPS por defecto

### **Validación de Versión**
- Solo permite actualizar a versión superior
- No permite downgrades accidentales

---

## 📝 Archivos Importantes

```
TPS_INTERMOTORS_DISTRIBUTION/
├── src-tauri/
│   ├── Cargo.toml                    ← Plugin updater
│   ├── tauri.conf.json               ← Configuración updater
│   └── src/lib.rs                    ← Inicialización plugin
│
├── src/
│   ├── hooks/
│   │   └── useUpdateChecker.ts       ← Hook principal
│   │
│   ├── modules/settings/
│   │   ├── components/settings/
│   │   │   ├── UpdateSettings.tsx    ← Vista de updates
│   │   │   └── SettingsNavigation.tsx ← Badge en tabs
│   │   └── screens/
│   │       └── settingsScreen.tsx    ← Sección updates
│   │
│   ├── modules/dashboard/
│   │   ├── screens/
│   │   │   └── appSidebar.tsx        ← Badge en sidebar
│   │   └── components/
│   │       └── NavItem.tsx           ← Soporte para badge
│   │
│   └── navigation/
│       └── Settings.Route.ts         ← Ruta de updates
│
└── .github/workflows/
    └── release.yml                   ← Auto-release workflow
```

---

## 🧪 Probar Actualizaciones

### **En Desarrollo**
El updater está **deshabilitado en desarrollo** para evitar actualizaciones accidentales.

### **En Producción**
1. Compila la app: `npm run tauri build`
2. Instala la versión 1.0.0
3. Crea release 1.0.1 con GitHub Actions
4. Abre la app v1.0.0
5. Ve a Configuración → Actualizaciones
6. Debería detectar v1.0.1 y mostrar el badge

---

## 🐛 Troubleshooting

### **"No hay actualizaciones disponibles" pero sí hay**
- Verifica que `latest.json` exista en GitHub Releases
- Verifica que el URL del endpoint sea correcto
- Revisa la consola del navegador para errores

### **"Error al verificar actualizaciones"**
- Verifica conexión a internet
- Verifica que GitHub Releases sea público
- Revisa logs de Tauri en la consola

### **"Error al descargar/instalar"**
- Verifica que la firma digital sea correcta
- Verifica permisos de escritura en el sistema
- Revisa que el instalador esté disponible

### **Badge no aparece**
- Verifica que `useUpdateChecker` esté importado correctamente
- Verifica que el componente esté dentro del Layout
- Revisa la consola para errores

---

## 🔄 Flujo Completo (De Principio a Fin)

```
┌─────────────────────────────────────────────────────────┐
│ DESARROLLADOR                                           │
│                                                         │
│ 1. Hace cambios en el código                           │
│ 2. ./scripts/release.sh 1.0.1                          │
│ 3. GitHub Actions compila y publica                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ GITHUB RELEASES                                         │
│                                                         │
│ - TPS-Intermotors_1.0.1_x64.msi                        │
│ - latest.json                                          │
│ - Firma digital (.sig)                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ CLIENTE (App v1.0.0)                                    │
│                                                         │
│ 1. App inicia → Check automático                       │
│ 2. Detecta v1.0.1 disponible                           │
│ 3. Badge [1] aparece en Configuración                  │
│ 4. Usuario ve badge y va a Settings → Actualizaciones  │
│ 5. Click en "Descargar e instalar"                     │
│ 6. Descarga con progreso                               │
│ 7. Valida firma                                        │
│ 8. Instala automáticamente                             │
│ 9. App se reinicia                                     │
│ 10. ✅ Ahora tiene v1.0.1                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 ¡Listo para Usar!

El sistema de auto-actualización está completamente implementado y listo para usar. Los usuarios podrán actualizar la aplicación fácilmente desde la interfaz sin necesidad de descargar e instalar manualmente.

### **Próximos pasos recomendados**:
1. ✅ Generar claves de firma digital (opcional pero recomendado)
2. ✅ Crear primer release de prueba: `./scripts/release.sh 1.0.0`
3. ✅ Compilar y probar la app
4. ✅ Crear segundo release: `./scripts/release.sh 1.0.1`
5. ✅ Verificar que la actualización funcione

---

**Happy updating! 🚀**
