use std::process::{Command, Child, Stdio};
use log::{info, error, warn};

pub struct VpnManager {
    vpn_process: Option<Child>,
}

impl VpnManager {
    pub fn new() -> Self {
        VpnManager {
            vpn_process: None,
        }
    }

    pub async fn connect(&mut self) -> Result<(), String> {
        info!("Iniciando conexión VPN...");

        // Rutas a los archivos VPN (bundleados con la app)
        let app_dir = std::env::current_exe()
            .map_err(|e| format!("Error obteniendo directorio de app: {}", e))?
            .parent()
            .ok_or("No se pudo obtener el directorio padre")?
            .to_path_buf();

        let config_path = app_dir.join("vpn").join("sslvpn-roger.leon-client-config.ovpn");
        let credentials_path = app_dir.join("vpn").join("vpnCredentials.txt");

        // Verificar que los archivos existen
        if !config_path.exists() {
            return Err(format!("Archivo de configuración VPN no encontrado: {:?}", config_path));
        }

        if !credentials_path.exists() {
            return Err(format!("Archivo de credenciales VPN no encontrado: {:?}", credentials_path));
        }

        info!("Archivos VPN encontrados, verificando instalación de OpenVPN...");

        // Crear archivo de log para debugging
        let log_path = app_dir.join("vpn-setup.log");
        let log_content = format!("=== TPS Intermotors VPN Setup Log ===\nFecha: {}\nDirectorio app: {:?}\nArchivos VPN encontrados:\n- Config: {:?}\n- Credentials: {:?}\n",
            chrono::Utc::now().format("%Y-%m-%d %H:%M:%S UTC"),
            app_dir,
            config_path,
            credentials_path
        );
        std::fs::write(&log_path, log_content).ok();

        // PRIMER PASO: Verificar si OpenVPN está instalado, si no, instalarlo automáticamente
        if cfg!(windows) && !self.is_openvpn_installed() {
            info!("OpenVPN no está instalado, ejecutando instalación automática...");

            // Agregar al log
            let mut log_content = std::fs::read_to_string(&log_path).unwrap_or_default();
            log_content.push_str("\n=== INSTALACIÓN AUTOMÁTICA DE OPENVPN ===\n");
            log_content.push_str("Estado: OpenVPN no detectado, iniciando instalación...\n");
            std::fs::write(&log_path, log_content).ok();

            self.install_openvpn_automatically(&app_dir).await?;

            // Actualizar log
            let mut log_content = std::fs::read_to_string(&log_path).unwrap_or_default();
            log_content.push_str("Estado: Instalación completada exitosamente\n");
            std::fs::write(&log_path, log_content).ok();
        } else {
            // Agregar al log
            let mut log_content = std::fs::read_to_string(&log_path).unwrap_or_default();
            log_content.push_str("\n=== VERIFICACIÓN OPENVPN ===\n");
            log_content.push_str("Estado: OpenVPN ya está instalado\n");
            std::fs::write(&log_path, log_content).ok();
        }

        // Intentar ejecutar OpenVPN con diferentes métodos según el SO
        let mut child = if cfg!(windows) {
            // En Windows: ejecutar directamente (asumiendo que la app ya tiene privilegios)
            info!("Sistema Windows detectado, iniciando OpenVPN...");

            // Intentar ejecutar OpenVPN directamente
            Command::new("openvpn.exe")
                .args(&[
                    "--config", config_path.to_str().unwrap(),
                    "--auth-user-pass", credentials_path.to_str().unwrap(),
                    "--log", app_dir.join("vpn.log").to_str().unwrap(),
                    "--writepid", app_dir.join("vpn.pid").to_str().unwrap()
                ])
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("Error ejecutando OpenVPN en Windows: {}. \n\nSOLUCIÓN:\n1. Verificar que OpenVPN esté instalado\n2. Ejecutar TPS Intermotors como ADMINISTRADOR\n3. Click derecho en TPS Intermotors → 'Ejecutar como administrador'", e))?
        } else {
            // En Linux: usar pkexec o sudo
            if let Ok(child) = Command::new("pkexec")
                .args(&[
                    "openvpn",
                    "--config", config_path.to_str().unwrap(),
                    "--auth-user-pass", credentials_path.to_str().unwrap(),
                    "--log", app_dir.join("vpn.log").to_str().unwrap(),
                    "--writepid", app_dir.join("vpn.pid").to_str().unwrap()
                ])
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
            {
                info!("OpenVPN iniciado con pkexec");
                child
            } else if let Ok(child) = Command::new("sudo")
                .args(&[
                    "-n", // No password prompt
                    "openvpn",
                    "--config", config_path.to_str().unwrap(),
                    "--auth-user-pass", credentials_path.to_str().unwrap(),
                    "--log", app_dir.join("vpn.log").to_str().unwrap(),
                    "--writepid", app_dir.join("vpn.pid").to_str().unwrap()
                ])
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
            {
                info!("OpenVPN iniciado con sudo");
                child
            } else {
                // Fallback: ejecutar sin privilegios elevados (fallará pero con mensaje claro)
                warn!("No se pueden obtener privilegios elevados, intentando sin permisos...");
                Command::new("openvpn")
                    .args(&[
                        "--config", config_path.to_str().unwrap(),
                        "--auth-user-pass", credentials_path.to_str().unwrap(),
                        "--log", app_dir.join("vpn.log").to_str().unwrap(),
                        "--writepid", app_dir.join("vpn.pid").to_str().unwrap()
                    ])
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
                    .map_err(|e| format!("Error ejecutando OpenVPN: {}. Necesitas configurar permisos elevados. Ver SETUP_VPN.md", e))?
            }
        };

        // Esperar un poco para que la conexión se establezca
        tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

        // Verificar si el proceso sigue corriendo
        match child.try_wait() {
            Ok(Some(status)) => {
                // El proceso terminó - verificar si fue exitoso o no
                warn!("Proceso OpenVPN terminó con código: {}", status);

                // Incluso si el proceso terminó, verificar si la VPN está funcionando
                if self.test_connectivity().await {
                    info!("VPN conectada exitosamente (proceso en background)");
                    // No guardar el child ya que terminó, pero la VPN funciona
                } else {
                    return Err(format!("OpenVPN terminó y no hay conectividad. Código: {}. Revisar logs en vpn.log", status));
                }
            }
            Ok(None) => {
                info!("Proceso OpenVPN ejecutándose, verificando conectividad...");

                // Verificar conectividad real
                if self.test_connectivity().await {
                    info!("VPN conectada exitosamente y funcionando");
                    self.vpn_process = Some(child);
                } else {
                    child.kill().ok();
                    return Err("VPN iniciada pero no hay conectividad con el servidor. Revisar credenciales y configuración.".to_string());
                }
            }
            Err(e) => {
                return Err(format!("Error verificando estado de OpenVPN: {}", e));
            }
        }

        Ok(())
    }

    pub fn is_connected(&self) -> bool {
        self.vpn_process.is_some()
    }

    async fn test_connectivity(&self) -> bool {
        // Probar conectividad con tu API
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .unwrap();

        match client.get("http://192.168.1.14:8588/api/v1")
            .send()
            .await
        {
            Ok(response) => {
                info!("Test de conectividad: HTTP {}", response.status());
                response.status().is_success() || response.status().as_u16() == 404 // 404 es OK, significa que llegamos al servidor
            }
            Err(e) => {
                warn!("Test de conectividad falló: {}", e);
                false
            }
        }
    }

    pub fn disconnect(&mut self) -> Result<(), String> {
        if let Some(mut process) = self.vpn_process.take() {
            info!("Desconectando VPN...");
            process.kill()
                .map_err(|e| format!("Error terminando proceso VPN: {}", e))?;

            match process.wait() {
                Ok(_) => info!("VPN desconectada"),
                Err(e) => warn!("Error esperando terminación de VPN: {}", e),
            }
        }
        Ok(())
    }

    // Verificar si OpenVPN está instalado
    fn is_openvpn_installed(&self) -> bool {
        if cfg!(windows) {
            // Verificar si existe el ejecutable de OpenVPN
            let openvpn_paths = [
                r"C:\Program Files\OpenVPN\bin\openvpn.exe",
                r"C:\Program Files (x86)\OpenVPN\bin\openvpn.exe",
            ];

            for path in &openvpn_paths {
                if std::path::Path::new(path).exists() {
                    info!("OpenVPN encontrado en: {}", path);
                    return true;
                }
            }

            // También verificar en el registro de Windows
            use std::process::Command;
            let output = Command::new("reg")
                .args(&["query", "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall", "/s", "/f", "OpenVPN"])
                .output();

            if let Ok(output) = output {
                let output_str = String::from_utf8_lossy(&output.stdout);
                if output_str.contains("OpenVPN") {
                    info!("OpenVPN encontrado en el registro de Windows");
                    return true;
                }
            }

            info!("OpenVPN no está instalado");
            false
        } else {
            // En Linux, verificar si openvpn está en el PATH
            std::process::Command::new("which")
                .arg("openvpn")
                .output()
                .map(|output| output.status.success())
                .unwrap_or(false)
        }
    }

    // Instalar OpenVPN automáticamente
    async fn install_openvpn_automatically(&self, app_dir: &std::path::Path) -> Result<(), String> {
        use std::process::Command;

        info!("Iniciando instalación automática de OpenVPN...");

        let openvpn_msi = app_dir.join("resources").join("openvpn-install.msi");
        let install_script = app_dir.join("resources").join("install-openvpn.ps1");

        // Verificar que los archivos existen
        if !openvpn_msi.exists() {
            return Err(format!("Instalador de OpenVPN no encontrado: {:?}", openvpn_msi));
        }

        if !install_script.exists() {
            return Err(format!("Script de instalación no encontrado: {:?}", install_script));
        }

        info!("Ejecutando script de instalación PowerShell...");

        // Ejecutar el script PowerShell con privilegios elevados
        let output = Command::new("powershell.exe")
            .args(&[
                "-ExecutionPolicy", "Bypass",
                "-Command",
                &format!(
                    "Start-Process powershell.exe -ArgumentList \"-ExecutionPolicy Bypass -File '{}' -AppDir '{}'\" -Verb RunAs -Wait",
                    install_script.display(),
                    app_dir.display()
                )
            ])
            .output()
            .map_err(|e| format!("Error ejecutando script de instalación: {}", e))?;

        if !output.status.success() {
            let error_msg = String::from_utf8_lossy(&output.stderr);
            return Err(format!("Error en la instalación de OpenVPN: {}", error_msg));
        }

        info!("Instalación de OpenVPN completada");

        // Esperar un poco para que se complete la instalación
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;

        // Verificar que se instaló correctamente
        if !self.is_openvpn_installed() {
            return Err("OpenVPN no se instaló correctamente. Por favor, ejecute la aplicación como administrador.".to_string());
        }

        info!("OpenVPN instalado y verificado correctamente");
        Ok(())
    }
}

impl Drop for VpnManager {
    fn drop(&mut self) {
        if let Err(e) = self.disconnect() {
            error!("Error desconectando VPN en Drop: {}", e);
        }
    }
}

// Comando Tauri para verificar estado de VPN
#[tauri::command]
pub async fn check_vpn_status() -> Result<bool, String> {
    // Verificar conectividad con tu API
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| format!("Error creando cliente HTTP: {}", e))?;

    match client.get("http://192.168.1.14:8588/api/v1")
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            info!("API Status check: HTTP {}", status);
            Ok(status.is_success() || status.as_u16() == 404)
        }
        Err(e) => {
            warn!("API Status check failed: {}", e);
            Ok(false)
        }
    }
}

// Comando Tauri para instalar OpenVPN manualmente
#[tauri::command]
pub async fn install_openvpn_command() -> Result<String, String> {
    use std::process::Command;

    // Obtener directorio de la aplicación
    let app_dir = std::env::current_exe()
        .map_err(|e| format!("Error obteniendo directorio de app: {}", e))?
        .parent()
        .ok_or("No se pudo obtener el directorio padre")?
        .to_path_buf();

    let script_path = app_dir.join("install-openvpn.ps1");

    if !script_path.exists() {
        return Err("Script de instalación de OpenVPN no encontrado. Reinstale la aplicación.".to_string());
    }

    info!("Ejecutando instalación manual de OpenVPN...");

    // Ejecutar script PowerShell con privilegios elevados
    let output = if cfg!(windows) {
        Command::new("powershell.exe")
            .args(&[
                "-ExecutionPolicy", "Bypass",
                "-Command",
                &format!(
                    "Start-Process powershell.exe -ArgumentList \"-ExecutionPolicy Bypass -File '{}' -AppDir '{}'\" -Verb RunAs -Wait",
                    script_path.display(),
                    app_dir.display()
                )
            ])
            .output()
            .map_err(|e| format!("Error ejecutando PowerShell: {}", e))?
    } else {
        return Err("Instalación automática de OpenVPN solo está disponible en Windows".to_string());
    };

    if output.status.success() {
        Ok("OpenVPN instalado correctamente. Reinicie la aplicación para conectarse automáticamente.".to_string())
    } else {
        let error_msg = String::from_utf8_lossy(&output.stderr);
        Err(format!("Error instalando OpenVPN: {}", error_msg))
    }
}