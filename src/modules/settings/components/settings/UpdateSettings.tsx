import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader } from '@/components/atoms/card';
import { Progress } from '@/components/atoms/progress';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';
import { Alert, AlertDescription } from '@/components/atoms/alert';
import { CheckCircle2, Download, RefreshCw, AlertCircle, Loader2, ArrowUpCircle, Package } from 'lucide-react';
import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';

export default function UpdateSettings() {
  const {
    available,
    currentVersion,
    latestVersion,
    isChecking,
    isDownloading,
    isInstalling,
    downloadProgress,
    error,
    checkForUpdates,
    downloadAndInstall,
    dismissUpdate,
    clearError,
  } = useUpdateChecker();

  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    getVersion().then(setAppVersion).catch(() => setAppVersion('1.0.0'));
  }, []);

  const displayCurrentVersion = currentVersion || appVersion;
  const displayLatestVersion = available ? latestVersion : displayCurrentVersion;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Actualizaciones</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Mantén tu aplicación al día con las últimas mejoras
        </p>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            {available ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                <ArrowUpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-semibold">
                {available ? 'Nueva versión disponible' : 'Todo está actualizado'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {available
                  ? `Actualización lista: v${displayLatestVersion}`
                  : 'Tienes la última versión instalada'
                }
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && !error.includes('Ya estás en la última versión') && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between gap-2">
                <span className="flex-1">{error}</span>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  Cerrar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Update Available Info */}
          {available && !error && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-900">
              <div className="flex gap-3">
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Versión {displayLatestVersion} lista para instalar
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Se recomienda actualizar para obtener las últimas mejoras y correcciones de seguridad
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Download/Install Progress */}
          {(isDownloading || isInstalling) && (
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm font-medium">
                    {isInstalling ? 'Instalando actualización' : 'Descargando actualización'}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums">{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
              {isInstalling && (
                <p className="text-xs text-muted-foreground">
                  La aplicación se reiniciará automáticamente al completar la instalación
                </p>
              )}
            </div>
          )}

          {/* Version Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Versión actual
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {displayCurrentVersion || '...'}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Última versión
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {displayLatestVersion || '...'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {!available && !isDownloading && !isInstalling && (
              <Button
                onClick={() => checkForUpdates(false)}
                disabled={isChecking}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando actualizaciones...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Buscar actualizaciones
                  </>
                )}
              </Button>
            )}

            {available && !isDownloading && !isInstalling && (
              <>
                <Button
                  onClick={downloadAndInstall}
                  className="flex-1"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Actualizar ahora
                </Button>
                <Button
                  onClick={dismissUpdate}
                  variant="outline"
                  size="lg"
                >
                  Más tarde
                </Button>
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Las actualizaciones se verifican automáticamente al iniciar la aplicación
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
