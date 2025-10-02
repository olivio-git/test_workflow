# 🔑 Certificado Auto-firmado (GRATIS)

## ⚠️ Importante
Esta opción reduce las advertencias pero NO las elimina completamente. Es útil para desarrollo y testing.

## 🛠️ Crear Certificado Auto-firmado

### En Windows (PowerShell como Admin):
```powershell
# Crear certificado auto-firmado
$cert = New-SelfSignedCertificate -Subject "CN=TPS Intermotors" -Type CodeSigning -KeyUsage DigitalSignature -FriendlyName "TPS Intermotors Code Signing" -CertStoreLocation "Cert:\CurrentUser\My" -KeyLength 2048

# Exportar certificado
$password = ConvertTo-SecureString -String "tu_password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath ".\tps-intermotors-cert.pfx" -Password $password

# Obtener thumbprint
$cert.Thumbprint
```

### Configurar en Tauri:
```bash
# Variables de entorno
export TAURI_SIGNING_PRIVATE_KEY_PATH="./tps-intermotors-cert.pfx"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="tu_password"

# Build con firma
npm run tauri build
```

## 🔍 Resultado

✅ **Mejoras:**
- Archivo firmado digitalmente
- Menos advertencias en algunos casos
- Validación de integridad

❌ **Limitaciones:**
- Sigue apareciendo advertencia "Publisher unknown"
- Usuario debe "confiar" manualmente
- No es válido para distribución comercial

## 💡 Uso Recomendado

- **Desarrollo y testing**
- **Distribución interna** en empresa
- **Demos y presentaciones**
- **Mientras ahorras** para certificado real