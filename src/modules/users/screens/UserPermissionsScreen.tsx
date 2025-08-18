// import { Badge } from '@/components/atoms/badge';
// import { Button } from '@/components/atoms/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/atoms/card';
// import { Checkbox } from '@/components/atoms/checkbox';
// import { Separator } from '@/components/atoms/separator';
// import { Skeleton } from '@/components/atoms/skeleton';
// import {
//   ArrowLeft,
//   CheckCircle,
//   Loader2,
//   Save,
//   Settings,
//   User2,
//   UserCog,
//   XCircle,
// } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { usePermissions } from '../hooks/usePermissions';
// import { useUpdateUserPermissions } from '../hooks/useUpdateUserPermissions';
// import { usePermissionsByUserId } from '../hooks/useUserById';
// import { useUserPermissions } from '../hooks/useUserPermissions';
// import type { Permission } from '../types/User';

// const UserPermissionsScreen = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const navigate = useNavigate();
//   const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
//     new Set()
//   );
//   const [isDirty, setIsDirty] = useState(false);
//   console.log(selectedPermissions)
//   const {
//     data: user,
//     isLoading: isLoadingUser,
//     isError: isUserError,
//   } = usePermissionsByUserId(Number(userId));

//   const { data: permissionsData, isLoading: isLoadingPermissions } =
//     usePermissions();

//   const { data: userPermissions, isLoading: isLoadingUserPermissions } =
//     useUserPermissions(Number(userId));

//   const { mutate: updatePermissions, isPending: isUpdatingPermissions } =
//     useUpdateUserPermissions();

//   // Cargar permisos actuales del usuario cuando estén disponibles
//   useEffect(() => {
//     if (userPermissions) {
//       const currentPermissions = new Set(userPermissions.map(p => p.name));
//       setSelectedPermissions(currentPermissions);
//       setIsDirty(false);
//     }
//   }, [userPermissions]);

//   const handlePermissionToggle = (permissionName: string) => {
//     setSelectedPermissions(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(permissionName)) {
//         newSet.delete(permissionName);
//       } else {
//         newSet.add(permissionName);
//       }
//       setIsDirty(true);
//       return newSet;
//     });
//   };

//   const handleSelectAllInGroup = (groupPermissions: Permission[]) => {
//     setSelectedPermissions(prev => {
//       const newSet = new Set(prev);
//       const allSelected = groupPermissions.every(p => newSet.has(p.name));

//       if (allSelected) {
//         // Deseleccionar todos del grupo
//         groupPermissions.forEach(p => newSet.delete(p.name));
//       } else {
//         // Seleccionar todos del grupo
//         groupPermissions.forEach(p => newSet.add(p.name));
//       }
//       setIsDirty(true);
//       return newSet;
//     });
//   };

//   const handleSave = () => {
//     if (!user) return;

//     const permissions: Permission[] = Array.from(selectedPermissions).map(
//       name => ({ name })
//     );

//     updatePermissions(
//       {
//         usuario: user.id,
//         permisos: permissions,
//       },
//       {
//         onSuccess: () => {
//           setIsDirty(false);
//           // Mostrar mensaje de éxito si quieres
//         },
//       }
//     );
//   };

//   const handleGoBack = () => {
//     if (isDirty) {
//       if (
//         window.confirm(
//           '¿Estás seguro de salir? Se perderán los cambios no guardados.'
//         )
//       ) {
//         navigate('/dashboard/user');
//       }
//     } else {
//       navigate('/dashboard/user');
//     }
//   };

//   const isGroupSelected = (groupPermissions: Permission[]) => {
//     return groupPermissions.every(p => selectedPermissions.has(p.name));
//   };

//   const isGroupPartiallySelected = (groupPermissions: Permission[]) => {
//     return (
//       groupPermissions.some(p => selectedPermissions.has(p.name)) &&
//       !isGroupSelected(groupPermissions)
//     );
//   };

//   if (isLoadingUser || isLoadingPermissions || isLoadingUserPermissions) {
//     return (
//       <div className="min-h-screen max-w-6xl mx-auto p-6">
//         <div className="space-y-6">
//           <div className="flex items-center gap-4">
//             <Skeleton className="h-10 w-32" />
//             <Skeleton className="h-6 w-48" />
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map(i => (
//               <Skeleton key={i} className="h-64 w-full" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isUserError || !user) {
//     return (
//       <div className="min-h-screen max-w-6xl mx-auto p-6">
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Error al cargar usuario
//           </h2>
//           <p className="text-gray-500 mb-4">
//             No se pudo encontrar el usuario solicitado
//           </p>
//           <Button onClick={() => navigate('/dashboard/user')}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Volver a la lista
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-4 mb-4">
//           <Button
//             variant="outline"
//             onClick={handleGoBack}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </div>

//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
//               <UserCog className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Permisos de Usuario
//               </h1>
//               <div className="flex items-center gap-2 mt-1">
//                 <User2 className="h-4 w-4 text-gray-500" />
//                 <span className="text-lg text-gray-600">
//                   {user.empleado.nombre}
//                 </span>
//                 <span className="text-gray-400">•</span>
//                 <span className="text-sm text-gray-500">@{user.nickname}</span>
//                 <Badge
//                   variant={user.activo ? 'success' : 'destructive'}
//                   className="flex items-center gap-1 ml-2"
//                 >
//                   {user.activo ? (
//                     <CheckCircle className="h-3 w-3" />
//                   ) : (
//                     <XCircle className="h-3 w-3" />
//                   )}
//                   {user.activo ? 'Activo' : 'Inactivo'}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <Button
//             onClick={handleSave}
//             disabled={!isDirty || isUpdatingPermissions}
//             className="flex items-center gap-2"
//           >
//             {isUpdatingPermissions ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Save className="h-4 w-4" />
//             )}
//             Guardar Permisos
//           </Button>
//         </div>

//         {/* Status Bar */}
//         <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-4">
//               <span className="text-gray-600">
//                 <strong>{selectedPermissions.size}</strong> permisos
//                 seleccionados
//               </span>
//               {permissionsData && (
//                 <span className="text-gray-600">
//                   de{' '}
//                   <strong>
//                     {Object.values(permissionsData).flat().length}
//                   </strong>{' '}
//                   disponibles
//                 </span>
//               )}
//             </div>
//             {isDirty && (
//               <div className="flex items-center gap-2 text-orange-600">
//                 <div className="h-2 w-2 bg-orange-600 rounded-full animate-pulse" />
//                 <span className="font-medium">Cambios sin guardar</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {permissionsData ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//           {Object.entries(permissionsData).map(
//             ([groupName, groupPermissions]) => (
//               <Card key={groupName} className="h-fit">
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-lg">{groupName}</CardTitle>
//                       <CardDescription>
//                         {groupPermissions.length} permisos disponibles
//                       </CardDescription>
//                     </div>
//                     <Badge variant="outline" className="text-xs">
//                       {
//                         groupPermissions.filter(p =>
//                           selectedPermissions.has(p.name)
//                         ).length
//                       }
//                       /{groupPermissions.length}
//                     </Badge>
//                   </div>

//                   <div className="flex items-center gap-2 pt-2">
//                     <Checkbox
//                       id={`group-${groupName}`}
//                       checked={
//                         isGroupPartiallySelected(groupPermissions)
//                           ? 'indeterminate'
//                           : isGroupSelected(groupPermissions)
//                       }
//                       onCheckedChange={() =>
//                         handleSelectAllInGroup(groupPermissions)
//                       }
//                     />
//                     <label
//                       htmlFor={`group-${groupName}`}
//                       className="text-sm font-medium leading-none cursor-pointer"
//                     >
//                       {isGroupSelected(groupPermissions)
//                         ? 'Deseleccionar todo'
//                         : 'Seleccionar todo'}
//                     </label>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0">
//                   <div className="space-y-3">
//                     {groupPermissions.map((permission, index) => (
//                       <div key={permission.name}>
//                         <div className="flex items-center space-x-3">
//                           <Checkbox
//                             id={permission.name}
//                             checked={selectedPermissions.has(permission.name)}
//                             onCheckedChange={() =>
//                               handlePermissionToggle(permission.name)
//                             }
//                           />
//                           <div className="flex-1 min-w-0">
//                             <label
//                               htmlFor={permission.name}
//                               className="text-sm font-medium leading-none cursor-pointer block"
//                             >
//                               <span className="font-mono text-xs text-blue-600 block">
//                                 {permission.name}
//                               </span>
//                               {/* Aquí podrías agregar descripciones si las tienes */}
//                             </label>
//                           </div>
//                         </div>
//                         {index < groupPermissions.length - 1 && (
//                           <Separator className="mt-3" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )
//           )}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No se pudieron cargar los permisos
//           </h3>
//           <p className="text-gray-500">
//             Ocurrió un error al obtener la estructura de permisos del sistema.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserPermissionsScreen;
