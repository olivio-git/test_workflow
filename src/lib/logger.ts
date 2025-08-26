import { environment } from "@/utils/environment";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: unknown;
    timestamp: string;
    module?: string;
}

export class Logger {
    private static isDevelopment = environment.app_env === 'development';
    private static isProduction = environment.app_env === 'production';

    private static createLogEntry(
        level: LogLevel,
        message: string,
        data?: unknown,
        module?: string
    ): LogEntry {
        return {
            level,
            message,
            data,
            timestamp: new Date().toISOString(),
            module,
        };
    }

    static info(message: string, data?: unknown, module?: string) {
        const entry = this.createLogEntry('info', message, data, module);

        if (this.isDevelopment) {
            console.log(`[INFO${module ? ` ${module}` : ''}] ${message}`, data || '');
        }

        if (this.isProduction) {
            // Enviar a servicio de logging (Sentry, DataDog, CloudWatch, etc.)
            this.sendToLoggingService(entry);
        }
    }

    static error(message: string, error?: unknown, module?: string) {
        const entry = this.createLogEntry('error', message, error, module);

        if (this.isDevelopment) {
            console.error(`[ERROR${module ? ` ${module}` : ''}] ${message}`, error || '');
        }

        if (this.isProduction) {
            this.sendToLoggingService(entry);
        }
    }

    static warn(message: string, data?: unknown, module?: string) {
        const entry = this.createLogEntry('warn', message, data, module);

        if (this.isDevelopment) {
            console.warn(`[WARN${module ? ` ${module}` : ''}] ${message}`, data || '');
        }

        if (this.isProduction) {
            this.sendToLoggingService(entry);
        }
    }

    static debug(message: string, data?: unknown, module?: string) {
        // const entry = this.createLogEntry('debug', message, data, module);

        if (this.isDevelopment) {
            console.debug(`[DEBUG${module ? ` ${module}` : ''}] ${message}`, data || '');
        }

        // Debug logs normalmente no se envían en producción
        // pero puedes cambiar esta lógica según tus necesidades
    }

    private static sendToLoggingService(entry: LogEntry) {
        // Implementar según tu proveedor de logging
        try {
            // Ejemplo con fetch a tu servicio de logging
            fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            }).catch(() => {
                // Silenciar errores de logging para no afectar UX
            });

            // O enviar a Sentry:
            // Sentry.addBreadcrumb({
            //   message: entry.message,
            //   level: entry.level,
            //   data: entry.data,
            // });
        } catch {
            // Silenciar errores de logging
        }
    }
}