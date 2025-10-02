# 📱 Aplicación Portable (GRATIS)

## ✅ Ventajas de App Portable

- ✅ **Totalmente GRATIS**
- ✅ **Sin instalación** requerida
- ✅ **Menos advertencias** de Windows
- ✅ **Fácil distribución** (un solo archivo)
- ✅ **No modifica** el registro de Windows

## 🚀 Cómo Crear

### Build Portable:
```bash
# Crear versión portable
npm run tauri build

# Resultado:
# src-tauri/target/release/bundle/app/TPS Intermotors.exe
```

### Distribución:
1. **Comprimir** el ejecutable en ZIP
2. **Subir** a GitHub Releases
3. **Usuarios descargan** y ejecutan directamente

## 📋 Instrucciones para Usuarios

### Descargar y Usar:
1. Descargar `TPS-Intermotors-Portable.zip`
2. Extraer a cualquier carpeta
3. Doble clic en `TPS Intermotors.exe`
4. ¡Listo! No requiere instalación

### Primera ejecución:
- Windows puede mostrar advertencia
- Clic en "Más información" → "Ejecutar de todas formas"
- **Solo una vez**, luego ejecuta normalmente

## 💡 Beneficios Adicionales

- **Llevalo en USB** a cualquier PC
- **No deja rastros** en el sistema
- **Configuración portable** (se guarda en la misma carpeta)
- **Ideal para testing** y demostraciones

## 🔧 Configuración Automática

He agregado "app" a los targets de build, ahora genera:
- `.msi` - Instalador tradicional
- `.nsis` - Instalador moderno
- `.exe` - **Aplicación portable**