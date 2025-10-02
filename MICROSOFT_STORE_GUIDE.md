# 🏪 Distribución en Microsoft Store (GRATIS)

## ✅ Ventajas de Microsoft Store

- ✅ **Totalmente GRATIS** para desarrolladores
- ✅ **Sin advertencias** de Windows SmartScreen
- ✅ **Actualizaciones automáticas**
- ✅ **Confianza automática** del usuario
- ✅ **Distribución global**

## 📋 Requisitos

### 1. Cuenta de Desarrollador
- **Costo:** $19 USD (una sola vez, no anual)
- **Validación:** 1-3 días hábiles
- **Beneficios:** Publicar apps ilimitadas

### 2. Preparar la App para Store

#### Cambios necesarios en `tauri.conf.json`:
```json
{
  "bundle": {
    "targets": ["msi", "appx"], // Agregar appx para Store
    "windows": {
      "certificateThumbprint": "",
      "wix": {
        "language": ["en-US"]
      }
    }
  }
}
```

#### Metadatos requeridos:
```json
{
  "productName": "TPS Intermotors",
  "version": "1.0.0",
  "identifier": "com.intermotors.tps",
  "description": "Sistema de gestión para TPS Intermotors",
  "authors": ["Tu Nombre"],
  "license": "MIT"
}
```

## 🚀 Proceso de Publicación

### Paso 1: Registro
1. Ir a [Microsoft Partner Center](https://partner.microsoft.com/)
2. Crear cuenta de desarrollador ($19 USD)
3. Completar verificación de identidad

### Paso 2: Preparar App
```bash
# Build para Microsoft Store
npm run tauri build -- --target appx

# Resultado en:
# src-tauri/target/release/bundle/appx/TPS Intermotors_1.0.0_x64.appx
```

### Paso 3: Subir a Store
1. Crear nueva aplicación en Partner Center
2. Subir archivo .appx
3. Completar metadatos:
   - Descripción
   - Screenshots
   - Categoría: "Productivity" o "Business"
   - Políticas de privacidad
4. Enviar para revisión (2-7 días)

## 💡 Beneficios Adicionales

- **Análisis detallados** de descargas
- **Reviews y ratings** de usuarios
- **Distribución automática** de actualizaciones
- **Monetización** futura (in-app purchases)

## 🔧 Configuración Recomendada

Para aplicaciones empresariales como TPS Intermotors:
- **Categoría:** Business & Productivity
- **Audiencia:** 13+ años
- **Precio:** Gratis
- **Disponibilidad:** Global

## ⏱️ Timeline

- **Registro:** 1-3 días
- **Primera app:** 2-7 días de revisión
- **Actualizaciones:** 1-2 días de revisión

**Total:** ~1-2 semanas para estar en Store