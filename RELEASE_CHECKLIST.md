# ✅ Checklist de Release - TPS Intermotors

## 📋 Pre-Release

Antes de crear un release, verifica:

- [ ] **Todos los cambios están commiteados**
  ```bash
  git status  # Debe estar limpio
  ```

- [ ] **Tests pasan localmente**
  ```bash
  npm run lint
  npm run build
  ```

- [ ] **La app funciona correctamente**
  ```bash
  npm run dev  # Prueba la aplicación
  ```

- [ ] **Estás en la rama correcta** (main o development)
  ```bash
  git branch --show-current
  ```

- [ ] **Has actualizado el CHANGELOG** (si lo tienes)

---

## 🚀 Crear Release

### Opción 1: Usando el script automatizado (Recomendado)

```bash
# Dar permisos al script (solo primera vez)
chmod +x scripts/release.sh

# Crear release
./scripts/release.sh 1.0.0
```

El script automáticamente:
- ✅ Valida el formato de versión
- ✅ Verifica que no haya cambios sin commit
- ✅ Actualiza package.json, tauri.conf.json, Cargo.toml
- ✅ Crea commit con mensaje "release: v1.0.0"
- ✅ Crea y sube el tag v1.0.0
- ✅ Muestra enlaces para monitorear el progreso

### Opción 2: Manual

1. **Actualizar versiones** en estos 3 archivos:
   - [ ] `package.json` → `"version": "1.0.0"`
   - [ ] `src-tauri/tauri.conf.json` → `"version": "1.0.0"`
   - [ ] `src-tauri/Cargo.toml` → `version = "1.0.0"`

2. **Commit y tag**:
   ```bash
   git add .
   git commit -m "release: v1.0.0"
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```

---

## 🔍 Post-Release

Después de hacer push del tag:

- [ ] **Ver progreso en GitHub Actions**
  - Ve a: `https://github.com/TU-USUARIO/TPS_INTERMOTORS_DISTRIBUTION/actions`
  - Verifica que los 3 jobs se ejecuten correctamente:
    - ✅ create-release
    - ✅ build-tauri (toma 15-20 min)
    - ✅ generate-update-manifest

- [ ] **Verificar que el Release fue creado**
  - Ve a: `https://github.com/TU-USUARIO/TPS_INTERMOTORS_DISTRIBUTION/releases`
  - Debe aparecer: "TPS Intermotors v1.0.0"

- [ ] **Verificar los assets del Release**
  - [ ] `TPS-Intermotors_1.0.0_x64_en-US.msi` (Instalador MSI)
  - [ ] `TPS-Intermotors_1.0.0_x64-setup.exe` (Instalador NSIS)
  - [ ] `TPS-Intermotors_1.0.0_x64_en-US.msi.sig` (Firma)
  - [ ] `latest.json` (Metadata para actualizaciones)
  - [ ] `Source code (zip)` (Código fuente)

- [ ] **Descargar y probar el instalador**
  - Descarga el .msi o .exe
  - Instala en una máquina de prueba
  - Verifica que funcione correctamente

- [ ] **Probar la actualización automática** (si ya implementaste Tauri Updater)
  - Abre la app anterior (v0.9.x)
  - Ve a Configuración → Buscar actualizaciones
  - Debe detectar la nueva versión (v1.0.0)
  - Actualiza y verifica que funcione

---

## 🐛 Si algo sale mal

### El build falla en GitHub Actions

1. **Ver los logs**:
   - Click en el job que falló en Actions
   - Lee el error específico

2. **Errores comunes**:
   - **TypeScript errors**: `npm run build` localmente para ver errores
   - **Rust errors**: `cd src-tauri && cargo build` para debuggear
   - **Missing dependencies**: Verifica que todas las dependencias estén en package.json

3. **Reintentar**:
   ```bash
   # Eliminar el tag y release fallido
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   # Eliminar el release en GitHub UI

   # Arreglar el problema y volver a intentar
   ./scripts/release.sh 1.0.0
   ```

### El release se creó pero falta un asset

- Espera a que terminen todos los jobs (15-20 min)
- Si después de 30 min sigue faltando, revisa los logs de GitHub Actions

---

## 📊 Versionado Semántico

Sigue esta convención para los números de versión:

```
MAJOR.MINOR.PATCH
  1  .  0  .  0
```

- **MAJOR** (1.x.x): Cambios que rompen compatibilidad
  - Ejemplo: Cambio de arquitectura, migración de DB incompatible

- **MINOR** (x.1.x): Nuevas funcionalidades compatibles
  - Ejemplo: Nueva pantalla de reportes, módulo de inventario

- **PATCH** (x.x.1): Bug fixes y cambios menores
  - Ejemplo: Corrección de errores, mejoras de UI

### Ejemplos:

```
0.1.0 → 0.2.0   (Nueva funcionalidad: Sistema de tabs)
0.2.0 → 0.2.1   (Bug fix: Error en formulario de ventas)
0.2.1 → 1.0.0   (Primera versión estable, producción ready)
1.0.0 → 1.1.0   (Nueva funcionalidad: Reportes en PDF)
1.1.0 → 2.0.0   (Cambio mayor: Nueva API backend incompatible)
```

---

## 🎯 Frecuencia Recomendada

- **Desarrollo activo**: Release cada 1-2 semanas
- **Producción estable**: Release cada 1-2 meses
- **Hotfixes críticos**: Release inmediato cuando sea necesario

---

## 📝 Notas Finales

- Mantén un registro de cambios (CHANGELOG.md) actualizado
- Comunica los releases a tus usuarios
- Prueba las actualizaciones automáticas antes de cada release
- Ten un plan de rollback por si algo falla

---

## 🔗 Referencias

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [RELEASE_GUIDE.md](RELEASE_GUIDE.md) - Guía detallada
- [GitHub Actions](https://docs.github.com/en/actions)
