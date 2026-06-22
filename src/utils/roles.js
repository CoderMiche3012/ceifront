import {
  Users,
  Heart,
  ClipboardList,
  BarChart3,
  User,
  CalendarPlus,
  Shield,
  History,
  MapPin
} from "lucide-react";

// módulos del sistema
export const modules = [
  {
    key: "seguridad",
    name: "Seguridad",
    icon: Shield,
    children: [
      {
        key: "roles",
        name: "Roles",
      },
      {
        key: "usuarios",
        name: "Usuarios",
      },
    ],
  },

  {
    key: "postulantes",
    name: "Postulantes",
    icon: ClipboardList,
    extraActions: [
      "aceptar",
      "rechazar",
    ]
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
        name: "Servicios (Comedor / Psicología)",
      },
      {
        key: "obligaciones",
        name: "Obligaciones",
      },
      {
        key: "fotografias",
        name: "Fotografias",
      },
      {
        key: "documentos",
        name: "Documentos",
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
    key: "periodos",
    name: "Periodos",
    icon: CalendarPlus,
  },

  {
    key: "reportes",
    name: "Reportes",
    icon: BarChart3,
    extraActions: ["exportar"],
  },

  {
    key: "historial",
    name: "Historial",
    icon: History,
  },

  {
    key: "direcciones",
    name: "Direcciones",
    icon: MapPin,
  }
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
  Eliminar: "eliminar",
  Migrar: "migrar",
  Aceptar: "aceptar",
  Rechazar: "rechazar",
  Exportar: "exportar",
};
const modulesWithDelete = [
  "fotografias",
  "documentos",
];
// obtiene todas las acciones de un módulo
export function getModuleActions(module) {
  // Reportes solo exporta
  if (module.key === "reportes") {
    return (module.extraActions || []).map(
      (action) => [
        extraActionsLabels[action] ||
        action,
        action,
      ]
    );
  }
  if (module.key === "historial") {
    return [
      ["Ver", "ver"],
      ["Editar", "editar"],
    ];
  }
  if (module.key === "direcciones") {
    return [["Crear", "crear"]];
  }

  const actions = [
    ["Ver", "ver"],
    ["Crear", "crear"],
    ["Editar", "editar"],
  ];

  if (
    modulesWithDelete.includes(
      module.key
    )
  ) {
    actions.push([
      "Eliminar",
      "eliminar",
    ]);
  }

  actions.push(
    ...(module.extraActions || []).map(
      (action) => [
        extraActionsLabels[action] ||
        action,
        action,
      ]
    )
  );

  return actions;
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
    // Reportes
    if (module.key === "reportes") {
      result[module.key] = {
        exportar: false,
      };

      return;
    }
    if (module.key === "historial") {
      result[module.key] = {
        ver: false,
        editar: false,
      };
      return;
    }
    if (module.key === "direcciones") {
      result[module.key] = {
        crear: false,
      };
      return;
    }

    result[module.key] = {
      ver: false,
      crear: false,
      editar: false,
    };

    if (
      modulesWithDelete.includes(
        module.key
      )
    ) {
      result[module.key].eliminar =
        false;
    }

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
        };

        if (
          modulesWithDelete.includes(
            child.key
          )
        ) {
          result[child.key].eliminar =
            false;
        }
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



