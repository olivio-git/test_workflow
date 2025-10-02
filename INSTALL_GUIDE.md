# 📦 Guía de Instalación - TPS Intermotors

## ⚠️ Mensaje de Seguridad de Windows

Al descargar TPS Intermotors, Windows puede mostrar una advertencia de seguridad. **Esto es normal** para aplicaciones independientes.

### ¿Por qué aparece esta advertencia?

- TPS Intermotors es una aplicación segura desarrollada independientemente
- Windows no reconoce al desarrollador porque no tenemos un certificado costoso ($600/año)
- Esto NO significa que la aplicación sea peligrosa

### 🔓 Cómo instalar correctamente:

#### Paso 1: Descargar
1. Ve a [Releases](https://github.com/tu-usuario/TPS_INTERMOTORS_DISTRIBUTION/releases)
2. Descarga `TPS-Intermotors-Setup.exe`

#### Paso 2: Al ejecutar el instalador
1. **Windows SmartScreen aparecerá**
2. Haz clic en **"Más información"**
3. Haz clic en **"Ejecutar de todas formas"**

#### Paso 3: Instalación
1. El instalador se ejecutará normalmente
2. No requiere permisos de administrador
3. Se instalará en tu carpeta de usuario

### 🛡️ ¿Es seguro?

✅ **SÍ, es completamente seguro:**
- Código fuente disponible en GitHub
- Sin acceso a archivos del sistema
- Sin conexiones a internet sospechosas
- Sin instalación de VPN o software adicional

### 🔍 Verificar integridad (Opcional)

Puedes verificar que el archivo no ha sido modificado:

```bash
# Checksums SHA256 disponibles en cada release
certutil -hashfile TPS-Intermotors-Setup.exe SHA256
```

### 🆘 ¿Problemas?

Si tienes problemas de instalación:
1. Desactiva temporalmente el antivirus
2. Ejecuta como administrador (clic derecho)
3. Reporta el problema en [Issues](https://github.com/tu-usuario/TPS_INTERMOTORS_DISTRIBUTION/issues)

---

**💡 Tip:** En el futuro, cuando TPS Intermotors tenga más usuarios, podremos obtener un certificado de código para eliminar estas advertencias.