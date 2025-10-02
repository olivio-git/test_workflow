# Script de instalación automática de OpenVPN para TPS Intermotors
# Este script se ejecuta con privilegios de administrador durante la instalación

param(
    [Parameter(Mandatory=$true)]
    [string]$AppDir
)

Write-Host "=== Instalación automática de OpenVPN para TPS Intermotors ===" -ForegroundColor Green
Write-Host "Directorio de la aplicación: $AppDir" -ForegroundColor Cyan

try {
    # Rutas de archivos
    $OpenVpnMsi = Join-Path $AppDir "openvpn-install.msi"
    $VpnConfigSource = Join-Path $AppDir "vpn\sslvpn-roger.leon-client-config.ovpn"
    $VpnCredentialsSource = Join-Path $AppDir "vpn\vpnCredentials.txt"

    # Directorio de configuración de OpenVPN
    $OpenVpnConfigDir = "${env:ProgramFiles}\OpenVPN\config"
    $OpenVpnBinDir = "${env:ProgramFiles}\OpenVPN\bin"

    Write-Host "Verificando archivos necesarios..." -ForegroundColor Yellow

    # Verificar que existen los archivos necesarios
    if (-not (Test-Path $OpenVpnMsi)) {
        throw "Archivo OpenVPN MSI no encontrado: $OpenVpnMsi"
    }

    if (-not (Test-Path $VpnConfigSource)) {
        throw "Archivo de configuración VPN no encontrado: $VpnConfigSource"
    }

    if (-not (Test-Path $VpnCredentialsSource)) {
        throw "Archivo de credenciales VPN no encontrado: $VpnCredentialsSource"
    }

    Write-Host "✓ Todos los archivos necesarios encontrados" -ForegroundColor Green

    # Verificar si OpenVPN ya está instalado
    $OpenVpnInstalled = Test-Path $OpenVpnBinDir

    if ($OpenVpnInstalled) {
        Write-Host "OpenVPN ya está instalado, omitiendo instalación..." -ForegroundColor Yellow
    } else {
        Write-Host "Instalando OpenVPN silenciosamente..." -ForegroundColor Yellow

        # Instalar OpenVPN silenciosamente
        $InstallArgs = @(
            "/i"
            "`"$OpenVpnMsi`""
            "/quiet"
            "/norestart"
            "ADDLOCAL=OpenVPN,OpenVPN.Service,Drivers.TAPWindows6"
        )

        $Process = Start-Process -FilePath "msiexec.exe" -ArgumentList $InstallArgs -Wait -PassThru

        if ($Process.ExitCode -ne 0) {
            throw "Error instalando OpenVPN. Código de salida: $($Process.ExitCode)"
        }

        Write-Host "✓ OpenVPN instalado correctamente" -ForegroundColor Green

        # Esperar a que se cree el directorio de configuración
        $Counter = 0
        while (-not (Test-Path $OpenVpnConfigDir) -and $Counter -lt 10) {
            Start-Sleep -Seconds 1
            $Counter++
        }

        if (-not (Test-Path $OpenVpnConfigDir)) {
            New-Item -ItemType Directory -Path $OpenVpnConfigDir -Force | Out-Null
            Write-Host "Directorio de configuración creado: $OpenVpnConfigDir" -ForegroundColor Yellow
        }
    }

    Write-Host "Copiando archivos de configuración VPN..." -ForegroundColor Yellow

    # Copiar configuración VPN
    $VpnConfigDest = Join-Path $OpenVpnConfigDir "tps-intermotors.ovpn"
    Copy-Item -Path $VpnConfigSource -Destination $VpnConfigDest -Force

    # Copiar credenciales (en un lugar seguro)
    $VpnCredentialsDest = Join-Path $OpenVpnConfigDir "tps-intermotors-credentials.txt"
    Copy-Item -Path $VpnCredentialsSource -Destination $VpnCredentialsDest -Force

    # Configurar permisos de seguridad para el archivo de credenciales
    $Acl = Get-Acl $VpnCredentialsDest
    $Acl.SetAccessRuleProtection($true, $false)  # Deshabilitar herencia

    # Dar permisos solo a Administradores y SYSTEM
    $AdminRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "FullControl", "Allow")
    $SystemRule = New-Object System.Security.AccessControl.FileSystemAccessRule("SYSTEM", "FullControl", "Allow")

    $Acl.SetAccessRule($AdminRule)
    $Acl.SetAccessRule($SystemRule)
    Set-Acl -Path $VpnCredentialsDest -AclObject $Acl

    Write-Host "✓ Archivos de configuración copiados y asegurados" -ForegroundColor Green

    # Actualizar el archivo de configuración para usar credenciales locales
    $ConfigContent = Get-Content $VpnConfigDest
    $ConfigContent = $ConfigContent -replace "auth-user-pass.*", "auth-user-pass `"$VpnCredentialsDest`""
    $ConfigContent | Set-Content $VpnConfigDest

    Write-Host "✓ Configuración actualizada para usar credenciales locales" -ForegroundColor Green

    # Crear servicio OpenVPN automático (opcional)
    Write-Host "Configurando servicio OpenVPN..." -ForegroundColor Yellow

    $ServiceName = "OpenVPNService"
    $Service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

    if ($Service) {
        Set-Service -Name $ServiceName -StartupType Manual
        Write-Host "✓ Servicio OpenVPN configurado como manual" -ForegroundColor Green
    }

    # Crear un script de inicio para la VPN
    $StartVpnScript = Join-Path $AppDir "start-vpn.bat"
    $StartVpnContent = @"
@echo off
echo Iniciando VPN TPS Intermotors...
cd /d "${OpenVpnBinDir}"
openvpn.exe --config "${VpnConfigDest}" --log "${AppDir}\vpn.log" --writepid "${AppDir}\vpn.pid"
"@

    $StartVpnContent | Set-Content $StartVpnScript

    Write-Host "✓ Script de inicio VPN creado: $StartVpnScript" -ForegroundColor Green

    # Agregar OpenVPN al PATH si no está
    $CurrentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    if ($CurrentPath -notlike "*$OpenVpnBinDir*") {
        $NewPath = "$CurrentPath;$OpenVpnBinDir"
        [Environment]::SetEnvironmentVariable("PATH", $NewPath, "Machine")
        Write-Host "✓ OpenVPN agregado al PATH del sistema" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "=== Instalación completada exitosamente ===" -ForegroundColor Green
    Write-Host "OpenVPN ha sido instalado y configurado automáticamente." -ForegroundColor White
    Write-Host "TPS Intermotors se conectará automáticamente a la VPN al iniciar." -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "La instalación de OpenVPN falló. Contacte al soporte técnico." -ForegroundColor Red
    exit 1
}