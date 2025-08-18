/**
 * Utilidades para el debug del módulo de usuarios
 */

import type { User, UserFilters, PermissionGroup } from '../types/User';

export const debugUser = (user: User) => {
  console.group(`🔍 Debug Usuario: ${user.nickname}`);
  console.log('📊 Datos completos:', user);
  console.log('🆔 ID:', user.id);
  console.log('👤 Nickname:', user.nickname);
  console.log('👨‍💼 Empleado:', user.empleado);
  console.log('📧 Email:', user.email || 'No registrado');
  console.log('✅ Estado:', user.activo ? 'Activo' : 'Inactivo');
  console.log('📅 Fecha creación:', user.fecha_creacion || 'No registrada');
  console.groupEnd();
};

export const debugUserFilters = (filters: UserFilters) => {
  console.group('🔍 Debug Filtros de Usuario');
  console.log('📄 Página:', filters.pagina);
  console.log('📊 Registros por página:', filters.pagina_registros);
  console.groupEnd();
};

export const debugPermissions = (permissions: PermissionGroup) => {
  console.group('🔍 Debug Permisos');
  console.log('📊 Grupos de permisos:', Object.keys(permissions).length);
  
  Object.entries(permissions).forEach(([groupName, groupPermissions]) => {
    console.group(`📋 Grupo: ${groupName}`);
    console.log(`🔢 Total permisos: ${groupPermissions.length}`);
    console.log('📝 Permisos:', groupPermissions.map(p => p.name));
    console.groupEnd();
  });
  
  console.groupEnd();
};

export const debugUserList = (users: User[]) => {
  console.group(`🔍 Debug Lista de Usuarios (${users.length} usuarios)`);
  
  const activeUsers = users.filter(u => u.activo);
  const inactiveUsers = users.filter(u => !u.activo);
  const usersWithEmail = users.filter(u => u.email);
  
  console.log('📊 Estadísticas:');
  console.log(`  ✅ Activos: ${activeUsers.length}`);
  console.log(`  ❌ Inactivos: ${inactiveUsers.length}`);
  console.log(`  📧 Con email: ${usersWithEmail.length}`);
  
  console.log('👥 Lista de usuarios:');
  users.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.nickname} (${user.empleado.nombre}) - ${user.activo ? '✅' : '❌'}`);
  });
  
  console.groupEnd();
};
