export const asistenciaKeys = {
  all: ["asistencias"],

  lists: () => [...asistenciaKeys.all, "list"],

  detail: (id) => [...asistenciaKeys.all, "detail", id],

  filtro: (mes, servicio) => [
    ...asistenciaKeys.all,
    "filtro",
    mes,
    servicio,
  ],
};