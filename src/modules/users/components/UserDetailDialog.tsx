import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import { Separator } from '@/components/atoms/separator';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { User2, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '../types/User';

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailDialog = ({ open, onClose, user }: UserDetailDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            Detalles del Usuario
          </DialogTitle>
          <DialogDescription>
            Información completa del usuario seleccionado
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Información Personal</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ID:</span>
                  <span className="text-sm font-medium">{user.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Nickname:</span>
                  <span className="text-sm font-medium">{user.nickname}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Empleado:</span>
                  <span className="text-sm font-medium">{user.empleado.nombre}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ID Empleado:</span>
                  <span className="text-sm font-medium">{user.empleado.id}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Estado y contacto */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Estado y Contacto</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estado:</span>
                  <Badge 
                    variant={user.activo ? "success" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {user.activo ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email:
                  </span>
                  <span className="text-sm font-medium">
                    {user.email || 'No registrado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha de creación:
                  </span>
                  <span className="text-sm font-medium">
                    {user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString('es-ES') : 'No registrada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
