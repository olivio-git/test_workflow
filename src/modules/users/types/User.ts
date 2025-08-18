export interface User {
  id: number;
  nickname: string;
  email: string | null;
  fecha_creacion: string | null;
  activo: boolean;
  empleado: {
    id: number;
    nombre: string;
  };
}

export interface UserFilters {
  pagina?: number;
  pagina_registros?: number;
}

export interface UserListResponse {
  data: User[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface Permission {
  name: string;
  categoria?: string | null;
  descripcion?: string | null;
}

export interface UserPermissionsRequest {
  usuario: number;
  permisos: Permission[];
}

export interface PermissionGroup {
  [key: string]: Permission[];
}
