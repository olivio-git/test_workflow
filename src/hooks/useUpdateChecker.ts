import { relaunch } from '@tauri-apps/plugin-process';
import { check, Update } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';

export interface UpdateState {
  available: boolean;
  currentVersion: string;
  latestVersion: string;
  isChecking: boolean;
  isDownloading: boolean;
  isInstalling: boolean;
  downloadProgress: number;
  error: string | null;
  update: Update | null;
}

export const useUpdateChecker = () => {
  const [updateState, setUpdateState] = useState<UpdateState>({
    available: false,
    currentVersion: '',
    latestVersion: '',
    isChecking: false,
    isDownloading: false,
    isInstalling: false,
    downloadProgress: 0,
    error: null,
    update: null,
  });

  // Check on mount
  useEffect(() => {
    // Solo verificar actualizaciones si estamos en Tauri
    if (typeof window !== 'undefined' && '__TAURI__' in window) {
      checkForUpdates();
    }
  }, []);

  const checkForUpdates = async (silent = true) => {
    // Solo funciona en Tauri
    if (typeof window === 'undefined' || !('__TAURI__' in window)) {
      console.log('Update checker only works in Tauri app');
      return;
    }

    if (updateState.isChecking) return;

    console.log('[Updater] Iniciando verificación de actualizaciones...');
    setUpdateState(prev => ({
      ...prev,
      isChecking: true,
      error: null,
    }));

    try {
      console.log('[Updater] Consultando endpoint de actualizaciones...');
      const update = await check();
      console.log('[Updater] Respuesta recibida:', {
        available: update?.available,
        currentVersion: update?.currentVersion,
        latestVersion: update?.version,
      });

      if (update?.available) {
        console.log('[Updater] ✅ Nueva actualización disponible:', update.version);
        setUpdateState(prev => ({
          ...prev,
          available: true,
          currentVersion: update.currentVersion,
          latestVersion: update.version,
          update,
          isChecking: false,
        }));
      } else {
        console.log('[Updater] ✓ Ya estás en la última versión');
        setUpdateState(prev => ({
          ...prev,
          available: false,
          currentVersion: update?.currentVersion || '',
          latestVersion: update?.currentVersion || '',
          isChecking: false,
        }));

        if (!silent) {
          // Si no es silencioso, el usuario verá el mensaje en la UI
          setUpdateState(prev => ({
            ...prev,
            error: 'Ya estás en la última versión',
          }));
        }
      }
    } catch (error) {
      console.error('[Updater] ❌ Error al verificar actualizaciones:', error);
      console.error('[Updater] Stack trace:', error instanceof Error ? error.stack : 'No stack available');
      const errorMessage = error instanceof Error
        ? `Error: ${error.message}`
        : `Error al verificar actualizaciones: ${JSON.stringify(error)}`;

      setUpdateState(prev => ({
        ...prev,
        isChecking: false,
        error: errorMessage,
      }));
    }
  };

  const downloadAndInstall = async () => {
    if (!updateState.update) {
      console.error('[Updater] No hay actualización disponible para descargar');
      return;
    }

    console.log('[Updater] Iniciando descarga e instalación...');
    setUpdateState(prev => ({
      ...prev,
      isDownloading: true,
      downloadProgress: 0,
      error: null,
    }));

    try {
      // Descargar con progreso
      let downloaded = 0;
      let contentLength = 0;

      await updateState.update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength || 0;
            console.log(`[Updater] 📥 Iniciando descarga: ${(contentLength / 1024 / 1024).toFixed(2)} MB`);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            const progress = contentLength > 0 ? (downloaded / contentLength) * 100 : 0;
            console.log(`[Updater] 📊 Progreso: ${progress.toFixed(1)}% (${(downloaded / 1024 / 1024).toFixed(2)} MB)`);
            setUpdateState(prev => ({
              ...prev,
              downloadProgress: progress,
            }));
            break;
          case 'Finished':
            console.log('[Updater] ✅ Descarga completada, instalando...');
            setUpdateState(prev => ({
              ...prev,
              isDownloading: false,
              isInstalling: true,
            }));
            break;
        }
      });

      console.log('[Updater] 🔄 Reiniciando aplicación...');
      // Reiniciar la aplicación para aplicar la actualización
      await relaunch();
    } catch (error) {
      console.error('[Updater] ❌ Error durante descarga/instalación:', error);
      console.error('[Updater] Detalles del error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        raw: error,
      });
      setUpdateState(prev => ({
        ...prev,
        isDownloading: false,
        isInstalling: false,
        error: error instanceof Error ? error.message : 'Error al descargar/instalar actualización',
      }));
    }
  };

  const dismissUpdate = () => {
    setUpdateState(prev => ({
      ...prev,
      available: false,
      update: null,
      error: null,
    }));
  };

  const clearError = () => {
    setUpdateState(prev => ({
      ...prev,
      error: null,
    }));
  };

  return {
    ...updateState,
    checkForUpdates,
    downloadAndInstall,
    dismissUpdate,
    clearError,
  };
};
