# Setup VPN Automática para Tauri

## Configuración requerida para VPN automática

### 1. Instalar OpenVPN
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openvpn

# Arch/Manjaro
sudo pacman -S openvpn

# CentOS/RHEL
sudo yum install openvpn
```

### 2. Configurar sudo sin contraseña para OpenVPN
Para que la aplicación Tauri pueda ejecutar OpenVPN automáticamente, necesitas configurar sudo:

```bash
# Crear archivo de configuración sudo
sudo visudo -f /etc/sudoers.d/openvpn-tauri

# Agregar esta línea (reemplaza 'username' con tu usuario):
%wheel ALL=(ALL) NOPASSWD: /usr/bin/openvpn

# En Ubuntu/Debian usa:
%sudo ALL=(ALL) NOPASSWD: /usr/bin/openvpn
```

### 3. Alternativa: Usar pkexec (más seguro)
Si prefieres no usar sudo, puedes usar pkexec:

```bash
# Crear policy file
sudo tee /usr/share/polkit-1/actions/com.tauri.openvpn.policy << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE policyconfig PUBLIC
 "-//freedesktop//DTD PolicyKit Policy Configuration 1.0//EN"
 "http://www.freedesktop.org/standards/PolicyKit/1/policyconfig.dtd">
<policyconfig>
  <action id="com.tauri.openvpn">
    <message>Ejecutar OpenVPN para aplicación Tauri</message>
    <defaults>
      <allow_any>auth_admin</allow_any>
      <allow_inactive>auth_admin</allow_inactive>
      <allow_active>yes</allow_active>
    </defaults>
    <annotate key="org.freedesktop.policykit.exec.path">/usr/bin/openvpn</annotate>
    <annotate key="org.freedesktop.policykit.exec.allow_gui">true</annotate>
  </action>
</policyconfig>
EOF
```

### 4. Verificar configuración
```bash
# Probar que OpenVPN se puede ejecutar sin contraseña
sudo openvpn --version

# Debería mostrar la versión sin pedir contraseña
```

## Distribución de la aplicación

### Para el cliente final:
1. **Opción 1: Instalador con setup automático**
   - El instalador configura automáticamente los permisos necesarios
   - Pide contraseña una sola vez durante la instalación

2. **Opción 2: Aplicación con popup de permisos**
   - La aplicación pide permisos elevados solo al conectar VPN
   - Usa `pkexec` para solicitar autenticación cuando es necesario

3. **Opción 3: Pre-configuración manual**
   - Enviar instrucciones al cliente para configurar sudo una vez
   - La aplicación funciona sin interrupciones después

### Recomendación:
Para distribución comercial, usar **Opción 1** con instalador que configure automáticamente los permisos durante la instalación.