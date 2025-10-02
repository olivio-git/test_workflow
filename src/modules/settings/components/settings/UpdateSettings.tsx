import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Progress } from '@/components/atoms/progress';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';
import { Alert, AlertDescription } from '@/components/atoms/alert';
import { CheckCircle2, Download, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Actualizaciones</h3>
        <p className="text-sm text-muted-foreground">
          Mantén tu aplicación actualizada con las últimas funcionalidades y correcciones de errores.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {available ? (
              <>
                <Download className="h-5 w-5 text-blue-500" />
                Nueva versión disponible
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Aplicación actualizada
              </>
            )}
          </CardTitle>
          <CardDescription>
            {currentVersion ? `Versión actual: ${currentVersion}` : 'Verificando versión...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  Cerrar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Update Available */}
          {available && !error && (
            <Alert className="border-blue-500 bg-blue-50">
              <Download className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-blue-900">
                    Versión {latestVersion} disponible
                  </p>
                  <p className="text-sm text-blue-700">
                    Se recomienda actualizar para obtener las últimas mejoras y correcciones.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Download/Install Progress */}
          {(isDownloading || isInstalling) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isInstalling ? 'Instalando actualización...' : 'Descargando actualización...'}
                </span>
                <span className="font-medium">{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
              {isInstalling && (
                <p className="text-xs text-muted-foreground">
                  La aplicación se reiniciará automáticamente al completar la instalación.
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!available && !isDownloading && !isInstalling && (
              <Button
                onClick={() => checkForUpdates(false)}
                disabled={isChecking}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
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
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar e instalar
                </Button>
                <Button
                  onClick={dismissUpdate}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Más tarde
                </Button>
              </>
            )}
          </div>

          {/* Current Version Info */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Versión actual</p>
                <p className="font-medium">{currentVersion || 'Desconocida'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Última versión</p>
                <p className="font-medium">
                  {available ? latestVersion : currentVersion || 'Desconocida'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t space-y-2">
            <h4 className="font-medium text-sm">Actualizaciones automáticas</h4>
            <p className="text-sm text-muted-foreground">
              La aplicación busca actualizaciones automáticamente al iniciar.
              También puedes verificar manualmente usando el botón de arriba.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
