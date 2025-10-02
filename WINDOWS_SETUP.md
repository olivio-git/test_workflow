# 🪟 Guía de Instalación - TPS Intermotors (Windows)

## 📋 **Requisitos Previos**

### **1. Instalar OpenVPN**
El cliente necesita OpenVPN instalado para que la aplicación funcione:

**Descargar**: https://openvpn.net/community-downloads/
- Seleccionar: "Windows 64-bit MSI installer"
- Instalar con configuración por defecto
- **¡IMPORTANTE!** Instalar como administrador

### **2. Configurar Windows Defender**
Windows Defender puede bloquear la aplicación:

#### **Método 1: Agregar Exclusión**
1. Abrir **Windows Security** (Windows Defender)
2. Ir a **Protección contra virus y amenazas**
3. Click en **Administrar configuración** (bajo Configuración)
4. Scroll hasta **Exclusiones** → **Agregar o quitar exclusiones**
5. **Agregar exclusión** → **Carpeta**
6. Seleccionar la carpeta donde se instalará TPS Intermotors

#### **Método 2: Permitir durante instalación**
- Windows Defender mostrará una advertencia
- Click en **Más información**
- Click en **Ejecutar de todas formas**

## 🚀 **Instalación de TPS Intermotors**

### **Opción A: Instalador NSIS (Recomendado)**
```
TPS Intermotors_0.1.0_x64-setup.exe
```

**Pasos:**
1. **Click derecho** en el instalador → **Ejecutar como administrador**
2. Si Windows Defender alerta → **Más información** → **Ejecutar de todas formas**
3. Seguir el asistente de instalación
4. **¡IMPORTANTE!** Durante la instalación marcar **"Ejecutar como administrador"**
5. La aplicación se instalará en el menú de aplicaciones

### **Opción B: Ejecutable Directo**
```
app.exe + WebView2Loader.dll
```

**Pasos:**
1. Copiar ambos archivos a una carpeta (ej: `C:\TPS-Intermotors\`)
2. **Click derecho** en `app.exe` → **Ejecutar como administrador**

## ⚙️ **Configuración Post-Instalación**

### **1. Verificar OpenVPN**
Abrir **Command Prompt** como administrador y ejecutar:
```cmd
openvpn --version
```
Debe mostrar la versión de OpenVPN.

### **2. Primer Arranque**
1. **Ejecutar TPS Intermotors como administrador** (¡IMPORTANTE!)
2. La aplicación intentará conectar automáticamente a la VPN
3. Si funciona, verás el login de la aplicación
4. Si no funciona, aparecerá un mensaje de error

## 🔧 **Solución de Problemas**

### **Problema: "La aplicación se queda cargando"**
**Causa**: VPN no se conectó automáticamente

**Solución**:
1. Verificar que OpenVPN esté instalado
2. **Ejecutar la aplicación como administrador**
3. Verificar que Windows Firewall no esté bloqueando OpenVPN

### **Problema: "Windows Defender bloquea la aplicación"**
**Solución**:
1. Agregar exclusión en Windows Defender (ver arriba)
2. O permitir temporalmente durante ejecución

### **Problema: "Error de permisos VPN"**
**Solución**:
1. **SIEMPRE ejecutar como administrador**
2. Verificar que el usuario tenga permisos de administrador
3. Si el problema persiste, ejecutar desde Command Prompt:
   ```cmd
   cd "C:\ruta\a\la\aplicacion"
   runas /user:Administrator app.exe
   ```

### **Problema: "No se encuentra OpenVPN"**
**Solución**:
1. Reinstalar OpenVPN desde: https://openvpn.net/community-downloads/
2. Verificar que esté en el PATH del sistema
3. Reiniciar Windows después de la instalación

## 📱 **Instrucciones Simplificadas para Cliente**

### **Para distribuir al cliente, incluir:**

1. **Archivos**:
   - `TPS Intermotors_0.1.0_x64-setup.exe`
   - Este documento (WINDOWS_SETUP.md)

2. **Instrucciones rápidas**:
   ```
   ANTES DE INSTALAR TPS INTERMOTORS:

   1. Descargar e instalar OpenVPN:
      https://openvpn.net/community-downloads/
      (Seleccionar "Windows 64-bit MSI installer")

   2. Instalar TPS Intermotors:
      - Click derecho en el instalador
      - "Ejecutar como administrador"
      - Si Windows alerta → "Más información" → "Ejecutar de todas formas"

   3. Ejecutar TPS Intermotors:
      - SIEMPRE como administrador
      - La VPN se conecta automáticamente
      - ¡Listo para usar!
   ```

## 🛡️ **Consideraciones de Seguridad**

### **¿Por qué se requieren permisos de administrador?**
- OpenVPN necesita crear interfaces de red virtuales (TAP/TUN)
- Windows requiere permisos elevados para estas operaciones
- Es normal y seguro para aplicaciones VPN

### **¿Es seguro agregar exclusiones en Windows Defender?**
- Sí, es una práctica común para aplicaciones empresariales
- La aplicación está firmada digitalmente (en producción)
- Solo excluir la carpeta específica de la aplicación

## 📞 **Soporte**

Si el cliente tiene problemas:
1. Verificar que siguió todos los pasos en orden
2. Ejecutar **siempre como administrador**
3. Verificar conexión a internet
4. Contactar soporte técnico con mensaje de error específico

## 🔄 **Actualizaciones**

Para actualizar:
1. Desinstalar versión anterior (Panel de Control → Programas)
2. Instalar nueva versión siguiendo los mismos pasos
3. OpenVPN no necesita reinstalación