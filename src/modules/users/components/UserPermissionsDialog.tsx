import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/checkbox';
import { Badge } from '@/components/atoms/badge';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { Separator } from '@/components/atoms/separator';
import { Loader2, Settings, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useUpdateUserPermissions } from '../hooks/useUpdateUserPermissions';
import type { User, Permission } from '../types/User';

interface UserPermissionsDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserPermissionsDialog = ({ open, onClose, user }: UserPermissionsDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);

  const { data: permissionsData, isLoading: isLoadingPermissions } = usePermissions();
  const { mutate: updatePermissions, isPending: isUpdatingPermissions } = useUpdateUserPermissions();

  // Reset state when dialog closes or user changes
  useEffect(() => {
    if (!open || !user) {
      setSelectedPermissions(new Set());
      setIsDirty(false);
    }
  }, [open, user]);

  const handlePermissionToggle = (permissionName: string) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionName)) {
        newSet.delete(permissionName);
      } else {
        newSet.add(permissionName);
      }
      setIsDirty(true);
      return newSet;
    });
  };

  const handleSelectAllInGroup = (groupPermissions: Permission[]) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      const allSelected = groupPermissions.every(p => newSet.has(p.name));
      
      if (allSelected) {
        // Deseleccionar todos del grupo
        groupPermissions.forEach(p => newSet.delete(p.name));
      } else {
        // Seleccionar todos del grupo
        groupPermissions.forEach(p => newSet.add(p.name));
      }
      setIsDirty(true);
      return newSet;
    });
  };

  const handleSave = () => {
    if (!user) return;

    const permissions: Permission[] = Array.from(selectedPermissions).map(name => ({ name }));
    
    updatePermissions({
      usuario: user.id,
      permisos: permissions,
    }, {
      onSuccess: () => {
        setIsDirty(false);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('¿Estás seguro de cerrar? Se perderán los cambios no guardados.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!user) return null;

  const isGroupSelected = (groupPermissions: Permission[]) => {
    return groupPermissions.every(p => selectedPermissions.has(p.name));
  };

  const isGroupPartiallySelected = (groupPermissions: Permission[]) => {
    return groupPermissions.some(p => selectedPermissions.has(p.name)) && !isGroupSelected(groupPermissions);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Permisos de Usuario: {user.empleado.nombre}
          </DialogTitle>
          <DialogDescription>
            Gestiona los permisos y accesos del usuario seleccionado
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          {isLoadingPermissions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando permisos...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {permissionsData && Object.entries(permissionsData).map(([groupName, groupPermissions]) => (
                <div key={groupName} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">{groupName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {groupPermissions.length} permisos
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAllInGroup(groupPermissions)}
                      className="text-xs"
                    >
                      {isGroupSelected(groupPermissions) ? 'Deseleccionar todo' : 'Seleccionar todo'}
                    </Button>
                  </div>

                  <div className="ml-4 space-y-2">
                    <Checkbox
                      id={`group-${groupName}`}
                      checked={isGroupSelected(groupPermissions)}
                      indeterminate={isGroupPartiallySelected(groupPermissions)}
                      onCheckedChange={() => handleSelectAllInGroup(groupPermissions)}
                      className="font-medium"
                    />
                    <label 
                      htmlFor={`group-${groupName}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
                    >
                      {groupName} (Todos)
                    </label>
                    
                    <div className="ml-6 grid grid-cols-1 gap-2">
                      {groupPermissions.map((permission) => (
                        <div key={permission.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.name}
                            checked={selectedPermissions.has(permission.name)}
                            onCheckedChange={() => handlePermissionToggle(permission.name)}
                          />
                          <label
                            htmlFor={permission.name}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            <span className="font-mono text-xs text-blue-600">{permission.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedPermissions.size} permisos seleccionados
            {isDirty && <span className="text-orange-600 ml-2">• Cambios sin guardar</span>}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isUpdatingPermissions}
            className="flex items-center gap-2"
          >
            {isUpdatingPermissions ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar Permisos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;