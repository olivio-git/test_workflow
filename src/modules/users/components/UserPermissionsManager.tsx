import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Checkbox } from '@/components/atoms/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';
import { Input } from '@/components/atoms/input';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { Skeleton } from '@/components/atoms/skeleton';
import { useToast } from '@/components/atoms/use-toast';
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Save,
  Search,
  Shield,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useUpdateUserPermissions } from '../hooks/useUpdateUserPermissions';
import { useUserPermissions } from '../hooks/useUserPermissions';
import type { Permission, PermissionGroup, User } from '../types/User';

interface UserPermissionsManagerProps {
  user: User | null;
  onPermissionsUpdated?: () => void;
}

const UserPermissionsManager = ({ user, onPermissionsUpdated }: UserPermissionsManagerProps) => {
  // Estados para gestión de permisos
  const [searchPermissions, setSearchPermissions] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  // Queries para permisos
  const {
    data: allPermissions,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
  } = usePermissions();

  const {
    data: userPermissions,
    isLoading: isLoadingUserPermissions,
    isError: isUserPermissionsError,
    refetch: refetchUserPermissions,
  } = useUserPermissions(user?.id || 0);

  const updateUserPermissionsMutation = useUpdateUserPermissions();

  // Procesar permisos y agruparlos
  const processedPermissions = useMemo<PermissionGroup>(() => {
    if (!allPermissions) return {};
    
    const grouped: PermissionGroup = {};
    
    Object.keys(allPermissions).forEach(category => {
      if (Array.isArray(allPermissions[category])) {
        grouped[category] = allPermissions[category];
      }
    });
    
    return grouped;
  }, [allPermissions]);

  // Filtrar permisos según búsqueda
  const filteredPermissions = useMemo(() => {
    if (!searchPermissions) return processedPermissions;
    
    const filtered: PermissionGroup = {};
    
    Object.keys(processedPermissions).forEach(category => {
      const categoryPermissions = processedPermissions[category].filter(
        permission => 
          permission.name.toLowerCase().includes(searchPermissions.toLowerCase()) ||
          permission.descripcion?.toLowerCase().includes(searchPermissions.toLowerCase()) ||
          category.toLowerCase().includes(searchPermissions.toLowerCase())
      );
      
      if (categoryPermissions.length > 0) {
        filtered[category] = categoryPermissions;
      }
    });
    
    return filtered;
  }, [processedPermissions, searchPermissions]);

  // Efecto para actualizar permisos seleccionados cuando cambian los permisos del usuario
  useEffect(() => {
    if (userPermissions) {
      const userPermissionNames = new Set(userPermissions.map(p => p.name));
      setSelectedPermissions(userPermissionNames);
    }
  }, [userPermissions]);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const togglePermission = (permissionName: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionName)) {
      newSelected.delete(permissionName);
    } else {
      newSelected.add(permissionName);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleAllInGroup = (groupName: string, permissions: Permission[]) => {
    const newSelected = new Set(selectedPermissions);
    const allSelected = permissions.every(p => newSelected.has(p.name));
    
    permissions.forEach(permission => {
      if (allSelected) {
        newSelected.delete(permission.name);
      } else {
        newSelected.add(permission.name);
      }
    });
    
    setSelectedPermissions(newSelected);
  };

  const handleSavePermissions = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const permissionsToSend = Array.from(selectedPermissions).map(name => {
        // Buscar el permiso completo en todos los grupos
        for (const category of Object.keys(processedPermissions)) {
          const permission = processedPermissions[category].find(p => p.name === name);
          if (permission) {
            return {
              name: permission.name,
              categoria: category,
              descripcion: permission.descripcion || null
            };
          }
        }
        return { name, categoria: null, descripcion: null };
      });

      await updateUserPermissionsMutation.mutateAsync({
        usuario: user.id,
        permisos: permissionsToSend
      });

      toast({
        title: 'Permisos actualizados',
        description: `Se han actualizado correctamente los permisos de ${user.empleado.nombre}`,
        variant: 'default',
      });

      // Refrescar permisos del usuario
      refetchUserPermissions();
      onPermissionsUpdated?.();
    } catch (error) {
      console.error('Error al guardar permisos:', error);
      toast({
        title: 'Error al guardar permisos',
        description: 'Ocurrió un error al intentar guardar los permisos del usuario',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getGroupStats = (permissions: Permission[]) => {
    const selected = permissions.filter(p => selectedPermissions.has(p.name)).length;
    const total = permissions.length;
    return { selected, total };
  };

  // Función para expandir todos los grupos con resultados de búsqueda
  useEffect(() => {
    if (searchPermissions && Object.keys(filteredPermissions).length > 0) {
      setExpandedGroups(new Set(Object.keys(filteredPermissions)));
    }
  }, [searchPermissions, filteredPermissions]);

  if (!user) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No se pudo cargar la información del usuario</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Gestión de Permisos</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSavePermissions}
              disabled={isSaving || isLoadingPermissions || isLoadingUserPermissions}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
        <CardDescription>
          Gestiona los permisos y accesos del usuario {user.empleado.nombre}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingPermissions || isLoadingUserPermissions ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : isPermissionsError || isUserPermissionsError ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error al cargar los permisos</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Buscador de permisos */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar permisos por nombre, descripción o categoría..."
                value={searchPermissions}
                onChange={(e) => setSearchPermissions(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Estadísticas generales */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">
                  Permisos seleccionados: {selectedPermissions.size}
                </span>
                <span className="text-blue-600">
                  Total disponible: {Object.values(processedPermissions).flat().length}
                </span>
              </div>
            </div>

            {/* Botones de acción rápida */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allPermissionNames = Object.values(processedPermissions)
                    .flat()
                    .map(p => p.name);
                  setSelectedPermissions(new Set(allPermissionNames));
                }}
                disabled={isSaving}
              >
                Seleccionar todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPermissions(new Set())}
                disabled={isSaving}
              >
                Deseleccionar todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (Object.keys(filteredPermissions).length > 0) {
                    setExpandedGroups(new Set(Object.keys(filteredPermissions)));
                  }
                }}
                disabled={isSaving}
              >
                Expandir todo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedGroups(new Set())}
                disabled={isSaving}
              >
                Colapsar todo
              </Button>
            </div>

            {/* Lista de permisos agrupados */}
            <ScrollArea className="h-96 w-full">
              <div className="space-y-2">
                {Object.keys(filteredPermissions).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchPermissions ? (
                      <>No se encontraron permisos que coincidan con "{searchPermissions}"</>
                    ) : (
                      'No hay permisos disponibles'
                    )}
                  </div>
                ) : (
                  Object.entries(filteredPermissions).map(([groupName, permissions]) => {
                    const stats = getGroupStats(permissions);
                    const isExpanded = expandedGroups.has(groupName);
                    const allSelected = permissions.every(p => selectedPermissions.has(p.name));
                    const someSelected = permissions.some(p => selectedPermissions.has(p.name));
                    
                    return (
                      <Collapsible key={groupName} open={isExpanded} onOpenChange={() => toggleGroup(groupName)}>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-600" />
                                )}
                                <Checkbox
                                  checked={allSelected}
                                  ref={(el) => {
                                    if (el) {
                                      el.indeterminate = someSelected && !allSelected;
                                    }
                                  }}
                                  onCheckedChange={() => toggleAllInGroup(groupName, permissions)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{groupName}</h3>
                                <p className="text-sm text-gray-500">
                                  {stats.selected}/{stats.total} permisos seleccionados
                                </p>
                              </div>
                            </div>
                            <Badge variant={stats.selected > 0 ? 'default' : 'secondary'}>
                              {stats.selected}/{stats.total}
                            </Badge>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="ml-6 mt-2 space-y-2">
                            {permissions.map(permission => (
                              <div
                                key={permission.name}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedPermissions.has(permission.name)}
                                    onCheckedChange={() => togglePermission(permission.name)}
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">
                                      {permission.name}
                                    </h4>
                                    {permission.descripcion && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {permission.descripcion}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Badge 
                                  variant={selectedPermissions.has(permission.name) ? 'success' : 'outline'}
                                  className="text-xs"
                                >
                                  {selectedPermissions.has(permission.name) ? 'Asignado' : 'No asignado'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPermissionsManager;
