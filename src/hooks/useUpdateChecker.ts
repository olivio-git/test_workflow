import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
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
    checkForUpdates();
  }, []);

  const checkForUpdates = async (silent = true) => {
    if (updateState.isChecking) return;

    setUpdateState(prev => ({
      ...prev,
      isChecking: true,
      error: null,
    }));

    try {
      const update = await check();

      if (update?.available) {
        setUpdateState(prev => ({
          ...prev,
          available: true,
          currentVersion: update.currentVersion,
          latestVersion: update.version,
          update,
          isChecking: false,
        }));
      } else {
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
      console.error('Error checking for updates:', error);
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
    if (!updateState.update) return;

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
            console.log(`Started downloading ${contentLength} bytes`);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            const progress = contentLength > 0 ? (downloaded / contentLength) * 100 : 0;
            setUpdateState(prev => ({
              ...prev,
              downloadProgress: progress,
            }));
            break;
          case 'Finished':
            console.log('Download finished');
            setUpdateState(prev => ({
              ...prev,
              isDownloading: false,
              isInstalling: true,
            }));
            break;
        }
      });

      // Reiniciar la aplicación para aplicar la actualización
      await relaunch();
    } catch (error) {
      console.error('Error downloading/installing update:', error);
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
