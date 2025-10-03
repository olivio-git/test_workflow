mod vpn;

use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{Manager, Emitter};
use vpn::VpnManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let vpn_manager = Arc::new(Mutex::new(VpnManager::new()));

  tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .manage(vpn_manager)
    .setup(|app| {
      // Habilitar logging tanto en desarrollo como en producción
      let log_level = if cfg!(debug_assertions) {
        log::LevelFilter::Debug
      } else {
        log::LevelFilter::Info
      };

      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log_level)
          .build(),
      )?;

      // Conectar VPN automáticamente al iniciar
      let app_handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        log::info!("Iniciando conexión VPN automática...");

        let vpn_state = app_handle.state::<Arc<Mutex<VpnManager>>>();
        let vpn_clone = vpn_state.inner().clone();

        let result = {
          let mut vpn_guard = vpn_clone.lock().await;
          vpn_guard.connect().await
        };

        match result {
          Ok(_) => {
            log::info!("VPN conectada exitosamente");
            let _ = app_handle.emit_to("main", "vpn-connected", "VPN conectada exitosamente");
          }
          Err(e) => {
            log::error!("Error conectando VPN: {}", e);
            let _ = app_handle.emit_to("main", "vpn-error", format!("Error conectando VPN: {}", e));
          }
        }
      });

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      vpn::check_vpn_status,
      connect_vpn_command,
      disconnect_vpn_command,
      vpn::install_openvpn_command
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn connect_vpn_command(vpn_manager: tauri::State<'_, Arc<Mutex<VpnManager>>>) -> Result<String, String> {
  let vpn_clone = vpn_manager.inner().clone();
  let result = {
    let mut vpn_guard = vpn_clone.lock().await;
    vpn_guard.connect().await
  };
  result.map(|_| "VPN conectada exitosamente".to_string())
}

#[tauri::command]
async fn disconnect_vpn_command(vpn_manager: tauri::State<'_, Arc<Mutex<VpnManager>>>) -> Result<String, String> {
  let vpn_clone = vpn_manager.inner().clone();
  let result = {
    let mut vpn_guard = vpn_clone.lock().await;
    vpn_guard.disconnect()
  };
  result.map(|_| "VPN desconectada exitosamente".to_string())
}
