# 🚀 Guía de Distribución TPS Intermotors

## 📋 Resumen

Esta guía explica cómo funciona el sistema automático de distribución e instalación de TPS Intermotors con VPN integrada.

## ✨ Características Implementadas

### 🔧 Instalación Automática
- **OpenVPN se instala automáticamente** durante la instalación de TPS Intermotors
- **Configuración VPN preconfigurada** incluida en el bundle
- **Credenciales VPN seguras** con permisos restrictivos
- **Sin intervención del usuario** - todo funciona automáticamente

### 🌐 Conexión VPN Automática
- **Auto-conexión al startup** - La app se conecta automáticamente a la VPN al iniciar
- **Validación de conectividad** - Verifica que la conexión VPN funcione antes de permitir acceso
- **Reconexión inteligente** - Reintenta conexión en caso de fallas
- **Interfaz de estado** - Componente visual para monitorear estado VPN

### 🛠️ Recuperación de Errores
- **Instalación manual de OpenVPN** - Botón para instalar OpenVPN si falla la instalación automática
- **Mensajes de error claros** - Guías específicas para resolver problemas
- **Logs detallados** - Archivos de log para depuración

## 📁 Estructura del Bundle

```
TPS Intermotors.exe
├── vpn/
│   ├── sslvpn-roger.leon-client-config.ovpn  # Configuración VPN
│   └── vpnCredentials.txt                     # Credenciales VPN
├── resources/
│   ├── openvpn-install.msi                   # Instalador OpenVPN
│   └── install-openvpn.ps1                   # Script de instalación
└── [archivos principales de la app]
```

## 🔄 Flujo de Instalación

### 1. Instalación Principal
```
Usuario ejecuta: TPS Intermotors.exe
         ↓
Hook NSIS ejecuta install-openvpn.ps1
         ↓
PowerShell instala OpenVPN silenciosamente
         ↓
Copia configuración VPN a C:\Program Files\OpenVPN\config\
         ↓
Configura permisos de seguridad
         ↓
TPS Intermotors se instala normalmente
```

### 2. Primer Arranque
```
Usuario abre TPS Intermotors
         ↓
App ejecuta auto-conexión VPN
         ↓
Verifica conectividad con API (192.168.1.14:8588)
         ↓
Si exitoso: App funciona normalmente
Si falla: Muestra interfaz VPN con opciones
```

## 🚀 Estrategias de Distribución

### **Para Demos/Clientes de Prueba:**

#### **Opción A: AppImage (Más Simple)**
1. **Envía solo el archivo `.AppImage`**
2. **Instrucciones al cliente:**
   ```
   1. Descargar el archivo TPS-Intermotors.AppImage
   2. Click derecho → Propiedades → Permisos → Marcar "Ejecutable"
   3. Doble click para ejecutar
   4. La primera vez pedirá contraseña para VPN
   ```

#### **Opción B: Instalador DEB (Más Profesional)**
1. **Envía el archivo `.deb`**
2. **Instrucciones al cliente:**
   ```
   1. Doble click en el archivo .deb
   2. Hacer click en "Instalar"
   3. Buscar "TPS Intermotors" en el menú de aplicaciones
   4. La primera vez pedirá contraseña para VPN
   ```

### **Para Distribución Masiva:**

#### **Setup Automático de Permisos VPN**
Crear un script de instalación que configure automáticamente los permisos:

```bash
#!/bin/bash
# install-tps.sh

# Instalar OpenVPN si no está instalado
sudo apt update
sudo apt install -y openvpn

# Configurar permisos para VPN sin contraseña
echo '%sudo ALL=(ALL) NOPASSWD: /usr/bin/openvpn' | sudo tee /etc/sudoers.d/tps-openvpn

# Instalar la aplicación
sudo dpkg -i tps-intermotors_0.1.0_amd64.deb

echo "Instalación completada. Busque 'TPS Intermotors' en sus aplicaciones."
```

## 🔧 Configuraciones Avanzadas

### **Diferentes Entornos:**
Puedes crear diferentes builds para diferentes entornos:

```bash
# Build para demo
DEMO_MODE=true npm run tauri:build

# Build para producción
PROD_MODE=true npm run tauri:build

# Build para staging
STAGING_MODE=true npm run tauri:build
```

### **Variables de Entorno en Runtime:**
La aplicación puede detectar archivos de configuración específicos:
- `config-demo.json` - Para demos
- `config-prod.json` - Para producción
- `config-local.json` - Para desarrollo local

## 📋 Checklist de Distribución

### **Antes de enviar a cliente:**
- [ ] ✅ Verificar que la VPN se conecta automáticamente
- [ ] ✅ Probar login en la aplicación
- [ ] ✅ Verificar funcionalidades principales
- [ ] ✅ Probar en máquina limpia (sin dependencias de desarrollo)
- [ ] ✅ Preparar instrucciones claras para el cliente

### **Archivos a incluir:**
- [ ] ✅ Instalador (`.AppImage` o `.deb`)
- [ ] ✅ Archivo README con instrucciones
- [ ] ✅ Script de instalación (opcional)
- [ ] ✅ Información de contacto para soporte

## 🆘 Solución de Problemas

### **Si VPN no conecta:**
1. Verificar que OpenVPN esté instalado
2. Ejecutar aplicación desde terminal para ver logs
3. Verificar permisos sudo para OpenVPN

### **Si aplicación no inicia:**
1. Verificar dependencias del sistema
2. Probar ejecutable desde terminal
3. Revisar logs en `~/.local/share/com.intermotors.tps/logs/`

## 🔄 Actualizaciones

Para actualizar la aplicación:
1. Generar nuevo build con versión incrementada
2. Cliente descarga nueva versión
3. Reemplazar archivo anterior (AppImage) o instalar nuevo paquete (DEB)