import {
  HiOutlineHome, HiOutlineUserGroup, HiOutlineUserAdd,
  HiOutlineHeart, HiOutlineUsers, HiOutlineChartBar,
} from "react-icons/hi";

export const mainMenu = [
  {
    label: "Inicio",
    path: "/app",
    icon: HiOutlineHome,
  },

  {
    label: "Beneficiarios",
    path: "/app/beneficiarios",
    icon: HiOutlineUserGroup,
    permission: {
      module: "beneficiarios",
      action: "ver",
    },
  },

  {
    label: "Nuevos Ingresos",
    path: "/app/ingresos",
    icon: HiOutlineUserAdd,
    permission: {
      module: "postulantes",
      action: "ver",
    },
  },

  {
    label: "Donadores",
    path: "/app/donadores",
    icon: HiOutlineHeart,
    permission: {
      module: "donadores",
      action: "ver",
    },
  },

  {
    label: "Asistencias",
    path: "/app/asistencias",
    icon: HiOutlineUsers,
    permission: {
      module: "beneficiarios",
      action: "ver",
    },
  },
];

export const reportesMenu = {
  label: "Reportes",
  path: "/app/reportes",
  icon: HiOutlineChartBar,

  permission: {
    module: "reportes",
    action: "ver",
  },
};

export const configSubmenu = [
  {
    label: "Usuarios",
    path: "/app/usuarios",

    permission: {
      module: "usuarios",
      action: "ver",
    },
  },

  {
    label: "Roles y Permisos",
    path: "/app/roles",

    permission: {
      module: "usuarios",
      action: "ver",
    },
  },

  {
    label: "Periodo Escolar",
    path: "/app/periodos",

    permission: {
      module: "periodos",
      action: "ver",
    },
  },
];