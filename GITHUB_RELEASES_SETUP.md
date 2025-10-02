# 🎯 Setup Completo: GitHub Releases con Auto-Updates

## ✅ Lo que se ha implementado

### 1. **Workflow de GitHub Actions** (`.github/workflows/release.yml`)

El workflow automático que:
- 🔍 Detecta cuando haces push de un tag (ejemplo: `v1.0.0`)
- 🏗️ Compila la aplicación automáticamente en la nube
- 📦 Genera instaladores (.msi y .exe)
- 🔐 Firma los archivos (si configuras las claves)
- 📤 Sube todo a GitHub Releases
- 📝 Genera `latest.json` para actualizaciones automáticas

### 2. **Script de Release** (`scripts/release.sh`)

Script que automatiza todo el proceso:
- ✅ Valida formato de versión
- ✅ Actualiza versiones en 3 archivos simultáneamente
- ✅ Crea commit y tag automáticamente
- ✅ Hace push y dispara el workflow
- ✅ Muestra enlaces para monitorear progreso

### 3. **Documentación Completa**

- 📖 **RELEASE_GUIDE.md**: Guía paso a paso detallada
- ✅ **RELEASE_CHECKLIST.md**: Checklist rápido pre/post release
- 📋 **Este archivo**: Resumen de setup y próximos pasos

---

## 🚀 Cómo usar (Quick Start)

### Primera vez: Setup

1. **Verifica que GitHub Actions esté habilitado**:
   - Ve a: `Settings → Actions → General`
   - Marca: "Allow all actions and reusable workflows"
   - En "Workflow permissions": Marca "Read and write permissions"
   - Guarda cambios

2. **Da permisos al script** (solo primera vez):
   ```bash
   chmod +x scripts/release.sh
   ```

### Crear un Release

```bash
# Es todo lo que necesitas:
./scripts/release.sh 1.0.0
```

Eso es todo! El script:
1. Actualiza las 3 versiones
2. Crea commit y tag
3. Sube a GitHub
4. GitHub Actions compila y publica automáticamente

---

## 📊 Flujo Visual

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TU COMPUTADORA                                           │
│                                                             │
│  $ ./scripts/release.sh 1.0.0                               │
│                                                             │
│    ├─ Actualiza package.json → v1.0.0                      │
│    ├─ Actualiza tauri.conf.json → v1.0.0                   │
│    ├─ Actualiza Cargo.toml → v1.0.0                        │
│    ├─ git commit -m "release: v1.0.0"                      │
│    ├─ git tag v1.0.0                                        │
│    └─ git push --tags                                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. GITHUB ACTIONS (Nube - Automático)                      │
│                                                             │
│  ⏱️  Duración: ~15-20 minutos                               │
│                                                             │
│  Job 1: create-release                                      │
│    └─ Crea release en GitHub                               │
│                                                             │
│  Job 2: build-tauri (Windows)                               │
│    ├─ Instala Node.js y Rust                               │
│    ├─ npm ci (instala dependencias)                        │
│    ├─ npm run build (compila React)                        │
│    ├─ cargo tauri build (compila Rust + empaqueta)         │
│    ├─ Genera TPS-Intermotors_1.0.0_x64_en-US.msi           │
│    ├─ Genera TPS-Intermotors_1.0.0_x64-setup.exe           │
│    ├─ Firma archivos (.sig)                                │
│    └─ Sube assets al release                               │
│                                                             │
│  Job 3: generate-update-manifest                            │
│    ├─ Descarga info de los assets                          │
│    ├─ Genera latest.json                                   │
│    └─ Sube latest.json al release                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. GITHUB RELEASES (Resultado)                             │
│                                                             │
│  📦 TPS Intermotors v1.0.0                                  │
│                                                             │
│  Assets disponibles:                                        │
│    📄 TPS-Intermotors_1.0.0_x64_en-US.msi        (45 MB)   │
│    📄 TPS-Intermotors_1.0.0_x64-setup.exe        (42 MB)   │
│    📄 TPS-Intermotors_1.0.0_x64_en-US.msi.sig    (1 KB)    │
│    📄 latest.json                                 (500 B)   │
│    📄 Source code (zip)                           (auto)    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CLIENTES (Con Tauri Updater configurado)                │
│                                                             │
│  App v0.9.0 detecta nueva versión:                         │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  🔔 Nueva versión disponible!                │           │
│  │                                              │           │
│  │  TPS Intermotors v1.0.0                      │           │
│  │                                              │           │
│  │  [Descargar e Instalar]  [Más tarde]        │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  → Usuario hace click en "Descargar e Instalar"            │
│  → Descarga desde GitHub Releases                          │
│  → Valida firma digital                                    │
│  → Instala automáticamente                                 │
│  → Reinicia app                                            │
│  → ✅ Ahora tiene v1.0.0                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuración Adicional (Opcional pero Recomendado)

### 1. Firma Digital de Código

Para que Windows no muestre advertencias de "publisher desconocido":

#### A) Generar claves (una vez)

```bash
# Instala tauri-cli globalmente
npm install -g @tauri-apps/cli

# Genera un par de claves
tauri signer generate -w ~/.tauri/tps-intermotors.key

# Output:
# Your keypair was generated successfully
# Private Key: se guardó en ~/.tauri/tps-intermotors.key
# Public Key: dW50cnVzdGVkIGNvbW1lbnQ...
```

**⚠️ IMPORTANTE**: Guarda la clave privada en un lugar seguro. Si la pierdes, no podrás firmar updates.

#### B) Agregar secretos a GitHub

1. Ve a tu repo: `Settings → Secrets and variables → Actions`
2. Click en "New repository secret"
3. Crea estos 2 secretos:

| Nombre | Valor |
|--------|-------|
| `TAURI_SIGNING_PRIVATE_KEY` | Contenido completo del archivo `~/.tauri/tps-intermotors.key` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Contraseña (si pusiste una al generar) |

#### C) Descomenta las líneas en el workflow

Edita `.github/workflows/release.yml`, busca estas líneas y descoméntalas:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  # Descomenta estas 2 líneas: ⬇️
  TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
  TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
```

#### D) Agregar public key a tauri.conf.json (para Tauri Updater)

```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://github.com/TU-USUARIO/TPS_INTERMOTORS_DISTRIBUTION/releases/latest/download/latest.json"
      ],
      "dialog": true,
      "pubkey": "TU_PUBLIC_KEY_AQUI"
    }
  }
}
```

---

## 📈 Agregar más plataformas (Linux, macOS)

Actualmente el workflow solo compila para Windows. Para agregar más:

Edita `.github/workflows/release.yml`, línea 46:

```yaml
strategy:
  matrix:
    platform: [windows-latest, ubuntu-22.04, macos-latest]  # Agregar plataformas
```

Y en `tauri.conf.json` agrega los targets:

```json
{
  "bundle": {
    "targets": ["msi", "nsis", "deb", "appimage", "dmg"]
  }
}
```

---

## 🎯 Próximos Pasos

Ahora que tienes releases automáticos, lo siguiente es implementar **Tauri Updater** para que los clientes puedan actualizar desde la app.

### Lo que necesitas implementar:

1. **Backend (Rust)**: Agregar plugin de Tauri Updater
2. **Frontend (React)**: Botón "Buscar actualizaciones" en Settings
3. **Configuración**: Habilitar updater en tauri.conf.json

Esto lo podemos hacer en el siguiente paso. Por ahora, ya tienes:
- ✅ Releases automáticos en GitHub
- ✅ Archivos listos para distribución
- ✅ Script para crear releases fácilmente

---

## 📝 Ejemplo Completo de Uso

```bash
# Día 1: Primera versión
./scripts/release.sh 1.0.0

# Día 15: Nueva funcionalidad
git commit -m "feat: sistema de reportes"
./scripts/release.sh 1.1.0

# Día 17: Bug fix urgente
git commit -m "fix: error en cálculo de total"
./scripts/release.sh 1.1.1

# Mes 2: Versión mayor con breaking changes
git commit -m "feat!: nueva API backend"
./scripts/release.sh 2.0.0
```

---

## 🐛 Troubleshooting Rápido

### Error: "Permission denied: ./scripts/release.sh"
```bash
chmod +x scripts/release.sh
```

### Error: "Tag already exists"
```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
# Luego intenta de nuevo
```

### Error: "GitHub Actions failed"
1. Ve a: `https://github.com/TU-USUARIO/TPS_INTERMOTORS_DISTRIBUTION/actions`
2. Click en el workflow que falló
3. Lee los logs para ver el error específico
4. Arregla el error localmente
5. Elimina el release y tag fallido
6. Intenta de nuevo

### El build es muy lento (>30 min)
- Es normal la primera vez (GitHub Actions descarga todo)
- Los siguientes builds usan caché y son más rápidos (~15 min)

---

## 📚 Archivos Importantes

```
TPS_INTERMOTORS_DISTRIBUTION/
├── .github/
│   └── workflows/
│       └── release.yml              ← Workflow automático
├── scripts/
│   └── release.sh                   ← Script para crear releases
├── GITHUB_RELEASES_SETUP.md         ← Este archivo
├── RELEASE_GUIDE.md                 ← Guía detallada
└── RELEASE_CHECKLIST.md             ← Checklist rápido
```

---

## ✅ Verificación Final

Antes de crear tu primer release, verifica:

- [ ] GitHub Actions está habilitado en el repo
- [ ] Workflow tiene permisos de "Read and write"
- [ ] Script tiene permisos de ejecución (`chmod +x`)
- [ ] Las versiones actuales son correctas
- [ ] No hay cambios sin commit

Si todo está ✅, puedes crear tu primer release:

```bash
./scripts/release.sh 1.0.0
```

¡Y listo! En 15-20 minutos tendrás tu primer release automático. 🎉

---

## 🆘 ¿Necesitas ayuda?

Si algo no funciona:
1. Revisa [RELEASE_GUIDE.md](RELEASE_GUIDE.md) para instrucciones detalladas
2. Verifica los logs en GitHub Actions
3. Usa [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) para asegurar que no falte nada

---

**Happy releasing! 🚀**
