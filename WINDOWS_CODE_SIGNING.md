# 🔐 Guía de Firma Digital para Windows

## Problema Actual
Windows SmartScreen marca el ejecutable como "no reconocido" porque no está firmado digitalmente.

## ✅ Cambios Realizados

### 1. Configuración de Tauri actualizada
- ✅ Targets cambiados a Windows: `["msi", "nsis"]`
- ✅ Modo de instalación: `currentUser` (no requiere admin)
- ✅ Configuración preparada para certificado de código
- ✅ Privilegios de administrador removidos

### 2. Configuración de Seguridad
- ✅ `allowElevation: false` - No solicita permisos de admin
- ✅ `installMode: currentUser` - Instalación por usuario
- ✅ Accesos directos automáticos en escritorio y menú inicio

## 🛡️ Soluciones para Eliminar Advertencias

### Opción 1: Certificado de Código (Recomendado)
**Costo: $200-600/año**

#### Proveedores Confiables:
- **SSL.com** - $199/año (más económico)
- **Sectigo** - $299/año
- **DigiCert** - $599/año (más prestigioso)

#### Proceso:
1. Comprar certificado de código
2. Validar identidad de la empresa
3. Descargar certificado (.p12/.pfx)
4. Configurar variables de entorno
5. Firmar ejecutables automáticamente

### Opción 2: Distribución Alternativa
**Costo: Gratis**

- **Microsoft Store** - Validación automática
- **Winget** - Repositorio oficial de Microsoft
- **Chocolatey** - Manager de paquetes popular

## 📋 Pasos para Implementar Firma Digital

### 1. Obtener Certificado
```bash
# Cuando tengas el certificado, crear directorio
mkdir certs
# Copiar certificate.p12 a ./certs/
```

### 2. Configurar Variables
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus datos:
TAURI_SIGNING_PRIVATE_KEY_PATH=./certs/certificate.p12
TAURI_SIGNING_PRIVATE_KEY_PASSWORD=tu_password
TIMESTAMP_URL=http://timestamp.digicert.com
```

### 3. Build con Firma
```bash
# Build automático con firma
npm run tauri build

# Verificar que está firmado
signtool verify /pa /v "src-tauri/target/release/bundle/msi/TPS Intermotors_0.1.0_x64_en-US.msi"
```

## 🚀 Beneficios de la Firma Digital

✅ **Sin advertencias** de Windows SmartScreen
✅ **Confianza automática** del sistema operativo
✅ **Instalación silenciosa** posible
✅ **Mejor experiencia** de usuario
✅ **Cumplimiento** de estándares de seguridad

## 💰 Recomendación

Para una empresa, recomiendo **SSL.com** por:
- Precio competitivo ($199/año)
- Soporte en español
- Proceso de validación rápido (2-3 días)
- Compatible con todas las herramientas de desarrollo

## 🔧 Configuración Actual Lista

Tu proyecto ya está configurado para:
- ✅ Firma automática cuando tengas certificado
- ✅ Instalación sin privilegios de administrador
- ✅ Distribución para Windows (MSI + NSIS)
- ✅ Sin dependencias de VPN

**Siguiente paso:** Obtener certificado de código de un proveedor confiable.