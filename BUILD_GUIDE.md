# 🔨 Guía de Compilación - TPS Intermotors

## 📋 Índice
1. [Problema Común: WebView2Loader.dll](#problema-común-webview2loaderdll)
2. [Soluciones](#soluciones)
3. [Scripts de Build](#scripts-de-build)
4. [Tipos de Instaladores](#tipos-de-instaladores)
5. [Troubleshooting](#troubleshooting)

---

## ❌ Problema Común: WebView2Loader.dll

### **Error:**
```
La ejecución del código no puede continuar porque no se encontró WebView2Loader.dll
```

### **Causa:**
Estás usando `--no-bundle` que solo genera el `.exe` sin empaquetar las dependencias necesarias:

```bash
# ❌ INCORRECTO - No incluye dependencias
RUSTFLAGS="-C linker=x86_64-w64-mingw32-gcc" \
tauri build --target x86_64-pc-windows-gnu --no-bundle
```

---

## ✅ Soluciones

### **Opción 1: Usar Instaladores (MSI/NSIS) - Recomendado**

Los instaladores incluyen **todas las dependencias** automáticamente:

```bash
# Compilar con instaladores
RUSTFLAGS="-C linker=x86_64-w64-mingw32-gcc" \
cargo tauri build --target x86_64-pc-windows-gnu

# O usar el script helper:
npm run tauri:build:win
```

**Resultado:**
```
src-tauri/target/x86_64-pc-windows-gnu/release/bundle/
├── msi/
│   └── TPS Intermotors_1.0.0_x64_en-US.msi        ← Instalador MSI
├── nsis/
│   └── TPS Intermotors_1.0.0_x64-setup.exe        ← Instalador NSIS
└── app/
    ├── TPS Intermotors.exe                         ← Ejecutable
    ├── WebView2Loader.dll                          ← Dependencias incluidas ✅
    └── ...otras DLLs
```

---

### **Opción 2: App Portable (Sin Instalador)**

Si necesitas un ejecutable portable que funcione sin instalación:

#### A) Configurar target "app"

Ya está configurado en [tauri.conf.json](src-tauri/tauri.conf.json:28):
```json
{
  "bundle": {
    "targets": ["msi", "nsis", "app"]
  }
}
```

#### B) Compilar

```bash
# Solo app portable
npm run tauri:build:win:portable

# O manualmente:
RUSTFLAGS="-C linker=x86_64-w64-mingw32-gcc" \
cargo tauri build --target x86_64-pc-windows-gnu
```

#### C) Resultado

```
src-tauri/target/x86_64-pc-windows-gnu/release/bundle/app/
└── TPS Intermotors/
    ├── TPS Intermotors.exe    ← Ejecutable
    ├── WebView2Loader.dll     ← Incluido ✅
    ├── resources/             ← Assets
    └── ...otras dependencias
```

**💡 La carpeta completa es portable**, puedes copiarla a cualquier PC con Windows.

---

## 🚀 Scripts de Build

Agregados a [package.json](package.json:11-16):

### **Todos los formatos**
```bash
npm run tauri:build:win
```
Genera: MSI + NSIS + App portable

### **Solo MSI**
```bash
npm run tauri:build:win:msi
```

### **Solo NSIS**
```bash
npm run tauri:build:win:nsis
```

### **Solo Portable**
```bash
npm run tauri:build:win:portable
```

---

## 📦 Tipos de Instaladores

### **1. MSI (Windows Installer)**
```
TPS Intermotors_1.0.0_x64_en-US.msi
```

**Características:**
- ✅ Instalador oficial de Windows
- ✅ Soporte para GPO (Group Policy)
- ✅ Desinstalación desde "Programas y características"
- ✅ Instalación silenciosa: `msiexec /i installer.msi /quiet`
- ✅ Compatible con auto-updates de Tauri

**Recomendado para:** Empresas, distribución corporativa

---

### **2. NSIS (Nullsoft Scriptable Install System)**
```
TPS Intermotors_1.0.0_x64-setup.exe
```

**Características:**
- ✅ Más flexible que MSI
- ✅ Instalador más pequeño
- ✅ Interfaz personalizable
- ✅ Compatible con auto-updates de Tauri

**Recomendado para:** Distribución general, usuarios finales

---

### **3. App Portable**
```
TPS Intermotors/
  ├── TPS Intermotors.exe
  ├── WebView2Loader.dll
  └── ...
```

**Características:**
- ✅ Sin instalación
- ✅ Portable (USB, carpeta compartida)
- ✅ No requiere permisos de administrador
- ❌ NO compatible con auto-updates
- ❌ Usuario debe instalar WebView2 manualmente (si no lo tiene)

**Recomendado para:** Testing, USB booteable, carpetas compartidas

---

## 🔧 Requisitos de Compilación

### **En Linux (Manjaro/Arch)**

```bash
# Compilador cross-platform
sudo pacman -S mingw-w64-gcc

# Rust target
rustup target add x86_64-pc-windows-gnu

# Node.js y npm (si no los tienes)
sudo pacman -S nodejs npm

# Dependencias de desarrollo
npm install
```

---

## 🎯 Flujo de Compilación Completo

```bash
# 1. Instalar dependencias (primera vez)
npm install

# 2. Compilar frontend
npm run build

# 3. Compilar para Windows con todos los formatos
npm run tauri:build:win

# 4. Resultado en:
ls -lh src-tauri/target/x86_64-pc-windows-gnu/release/bundle/
```

---

## 📊 Comparación de Métodos

| Método | Incluye DLLs | Instalador | Auto-Update | Portable | Recomendado |
|--------|--------------|------------|-------------|----------|-------------|
| `--no-bundle` | ❌ | ❌ | ❌ | ❌ | ❌ |
| MSI | ✅ | ✅ | ✅ | ❌ | ✅ |
| NSIS | ✅ | ✅ | ✅ | ❌ | ✅ |
| App Bundle | ✅ | ❌ | ❌ | ✅ | ⚠️ |

---

## 🐛 Troubleshooting

### **Error: "WebView2Loader.dll no encontrado"**

**Causa:** Usaste `--no-bundle`
**Solución:** Usa uno de los bundles (msi/nsis/app)

```bash
# ✅ Correcto
npm run tauri:build:win
```

---

### **Error: "x86_64-w64-mingw32-gcc: command not found"**

**Causa:** Falta el compilador cross-platform
**Solución:**

```bash
# Manjaro/Arch
sudo pacman -S mingw-w64-gcc

# Ubuntu/Debian
sudo apt install gcc-mingw-w64-x86-64

# Fedora
sudo dnf install mingw64-gcc
```

---

### **Error: "error: failed to run custom build command for `windows`"**

**Causa:** Falta el target de Rust
**Solución:**

```bash
rustup target add x86_64-pc-windows-gnu
```

---

### **App no abre en Windows: "WebView2 no está instalado"**

**Causa:** Windows no tiene WebView2 Runtime
**Solución:**

**Para Instaladores (MSI/NSIS):**
- Ya está configurado para instalarlo automáticamente
- Ver [tauri.conf.json](src-tauri/tauri.conf.json:38-40)

**Para App Portable:**
- Usuario debe instalar manualmente: https://go.microsoft.com/fwlink/p/?LinkId=2124703
- O distribuir `MicrosoftEdgeWebview2Setup.exe` junto con tu app

---

### **Build muy lento (>30 min)**

**Causa:** Primera compilación descarga y compila todo
**Optimizaciones:**

```bash
# 1. Usar caché de Cargo
export CARGO_HOME=~/.cargo

# 2. Compilar solo release (más rápido)
cargo tauri build --release

# 3. Compilaciones incrementales
# Ya están habilitadas por defecto
```

---

## 📝 Resumen de Comandos

```bash
# Build completo (todos los formatos)
npm run tauri:build:win

# Solo MSI
npm run tauri:build:win:msi

# Solo NSIS
npm run tauri:build:win:nsis

# Solo Portable
npm run tauri:build:win:portable

# Build manual con más control
RUSTFLAGS="-C linker=x86_64-w64-mingw32-gcc" \
cargo tauri build --target x86_64-pc-windows-gnu
```

---

## 🎯 Recomendaciones

### **Para Desarrollo/Testing:**
```bash
# Rápido, solo portable
npm run tauri:build:win:portable
```

### **Para Distribución:**
```bash
# Ambos instaladores
npm run tauri:build:win:msi
npm run tauri:build:win:nsis
```

### **Para GitHub Releases (CI/CD):**
```bash
# El workflow ya usa MSI + NSIS automáticamente
./scripts/release.sh 1.0.0
```

---

## 🔗 Enlaces Útiles

- [Documentación de Tauri Building](https://tauri.app/v1/guides/building/)
- [WebView2 Runtime Download](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [MSI Documentation](https://docs.microsoft.com/en-us/windows/win32/msi/windows-installer-portal)

---

## ✅ Checklist de Build

Antes de distribuir:

- [ ] Compilar con uno de los instaladores (MSI/NSIS)
- [ ] Probar instalación en Windows 10/11 limpio
- [ ] Verificar que WebView2 se instale automáticamente
- [ ] Probar desinstalación
- [ ] Verificar que los iconos aparezcan correctamente
- [ ] Probar la app después de instalar
- [ ] Si usas portable: incluir instrucciones para instalar WebView2

---

**Happy building! 🚀**
