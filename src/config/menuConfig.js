import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineHeart,
  HiOutlineUsers,
  HiOutlineChartBar,
} from "react-icons/hi"

export const mainMenu = [
  { label: "Inicio", path: "/app", icon: HiOutlineHome },
  {
    label: "Beneficiarios",
    path: "/app/beneficiarios",
    icon: HiOutlineUserGroup,
    permission: "Ver Beneficiarios",
  },
  {
    label: "Postulantes",
    path: "/app/postulantes",
    icon: HiOutlineUserAdd,
    permission: "Ver Postulantes",
  },
  {
    label: "Donadores",
    path: "/app/donadores",
    icon: HiOutlineHeart,
    permission: "Ver Donadores",
  },
  {
    label: "Voluntarios",
    path: "/app/voluntarios",
    icon: HiOutlineUsers,
    permission: "Ver Voluntarios",
  },
]

export const reportesMenu = {
  label: "Reportes",
  path: "/app/reportes",
  icon: HiOutlineChartBar,
  permission: "Ver Reportes",
}

export const configSubmenu = [
  {
    label: "Usuarios",
    path: "/app/usuarios",
    permission: "Ver Usuarios",
  },
  {
    label: "Roles y Permisos",
    path: "/app/roles",
    permission: "Ver Permisos",
  },
]