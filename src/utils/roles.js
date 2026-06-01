import {
  Users,
  Heart,
  ClipboardList,
  BarChart3,
  User,
  CalendarPlus,
  Shield,
} from "lucide-react";

// módulos del sistema
export const modules = [
  {
    key: "usuarios",
    name: "Usuarios",
    icon: User,
  },
  {
    key: "periodos",
    name: "Periodos",
    icon: CalendarPlus,
    extraActions: ["migrar"],
  },
  {
    key: "postulantes",
    name: "Postulantes",
    icon: ClipboardList,
    children: [
      {
        key: "familia",
        name: "Familia",
      },
      {
        key: "expedientes",
        name: "Expedientes",
      },
      {
        key: "estudios",
        name: "Estudios",
      },
      {
        key: "visitas",
        name: "Visitas",
      },
    ],
    extraActions: [
      "aceptar",
      "rechazar",
    ],
  },
  {
    key: "beneficiarios",
    name: "Beneficiarios",
    icon: Users,
    children: [
      {
        key: "seguimientos",
        name: "Seguimientos",
      },
      {
        key: "datos_escolares",
        name: "Datos escolares",
      },
      {
        key: "apoyos",
        name: "Apoyos",
      },
      {
        key: "servicios",
        name: "Servicios",
      },
      {
        key: "obligaciones",
        name: "Obligaciones",
      },
    ],
  },
  {
    key: "donadores",
    name: "Donadores",
    icon: Heart,
    children: [
      {
        key: "donativos",
        name: "Donativos",
      },
    ],
  },
  {
    key: "reportes",
    name: "Reportes",
    icon: BarChart3,
    extraActions: ["exportar"],
  },
];

// acciones estándar
export const baseActions = {
  Ver: "ver",
  Crear: "crear",
  Editar: "editar",
  Eliminar: "eliminar",
};

// etiquetas para acciones especiales
export const extraActionsLabels = {
  migrar: "Migrar",
  aceptar: "Aceptar",
  rechazar: "Rechazar",
  exportar: "Exportar",
};

// compatibilidad con componentes viejos
export const actionsMap = {
  ...baseActions,
  Migrar: "migrar",
  Aceptar: "aceptar",
  Rechazar: "rechazar",
  Exportar: "exportar",
};

// obtiene todas las acciones de un módulo
export function getModuleActions(module) {
  return [
    ["Ver", "ver"],
    ["Crear", "crear"],
    ["Editar", "editar"],
    ["Eliminar", "eliminar"],
    ...(module.extraActions || []).map(
      (action) => [
        extraActionsLabels[action] ||
          action,
        action,
      ]
    ),
  ];
}

// catálogo plano de módulos y submódulos
export const flatModules = new Set(
  modules.flatMap((module) => [
    module.key,
    ...(module.children?.map(
      (child) => child.key
    ) || []),
  ])
);

// genera un objeto base de permisos con todos en false
export function getEmptyPermissions() {
  const result = {};

  modules.forEach((module) => {
    result[module.key] = {
      ver: false,
      crear: false,
      editar: false,
      eliminar: false,
    };

    // permisos especiales
    module.extraActions?.forEach(
      (action) => {
        result[module.key][action] =
          false;
      }
    );

    // submódulos
    module.children?.forEach(
      (child) => {
        result[child.key] = {
          ver: false,
          crear: false,
          editar: false,
          eliminar: false,
        };
      }
    );
  });

  return result;
}

// objeto vacío reutilizable de permisos
export const emptyPermissions =
  Object.freeze(
    getEmptyPermissions()
  );

// convierte nombre_permiso → módulo + acción
export function permissionNameToModuleAction(
  nombrePermiso
) {
  if (
    !nombrePermiso ||
    !nombrePermiso.includes(".")
  ) {
    return null;
  }

  const [moduleKey, actionKey] =
    nombrePermiso
      .trim()
      .toLowerCase()
      .split(".");

  if (!flatModules.has(moduleKey)) {
    return null;
  }

  return {
    moduleKey,
    actionKey,
  };
}

// convierte un rol del backend a objeto de permisos
export function roleToPermissionsObject(
  role,
  catalog
) {
  const result =
    getEmptyPermissions();

  const permissionIds =
    role?.permisos || [];

  permissionIds.forEach(
    (permissionId) => {
      const permission =
        catalog.find(
          (item) =>
            item.id_permiso ===
            permissionId
        );

      if (!permission) return;

      const parsed =
        permissionNameToModuleAction(
          permission.nombre_permiso
        );

      if (!parsed) return;

      if (
        result?.[
          parsed.moduleKey
        ]?.hasOwnProperty(
          parsed.actionKey
        )
      ) {
        result[
          parsed.moduleKey
        ][parsed.actionKey] = true;
      }
    }
  );

  return result;
}

// convierte el objeto de permisos a ids para enviar al backend
export function permissionsObjectToIds(
  permissionsObject,
  catalog
) {
  const selectedIds = [];

  catalog.forEach((permission) => {
    const parsed =
      permissionNameToModuleAction(
        permission.nombre_permiso
      );

    if (!parsed) return;

    const isChecked =
      permissionsObject?.[
        parsed.moduleKey
      ]?.[parsed.actionKey] ===
      true;

    if (isChecked) {
      selectedIds.push(
        permission.id_permiso
      );
    }
  });

  return selectedIds;
}

// verifica si un rol es protegido
export function isProtectedRole(role) {
  if (!role?.nombre_rol) {
    return false;
  }

  const roleName =
    role.nombre_rol
      .trim()
      .toLowerCase();

  return [
    "administrador",
    "super admin",
    "superadmin",
    "admin",
  ].includes(roleName);
}