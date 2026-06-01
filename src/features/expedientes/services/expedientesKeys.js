export const expedientesKeys = {
  all: ["expedientes"],

  lists: () => [
    ...expedientesKeys.all,
    "list",
  ],

  list: (filters) => [
    ...expedientesKeys.lists(),
    filters,
  ],

  detail: (id) => [
    ...expedientesKeys.all,
    "detail",
    id,
  ],
};