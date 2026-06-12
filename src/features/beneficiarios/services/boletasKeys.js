export const boletasKeys = {
  all: ["boletas"],
  lists: () => [...boletasKeys.all, "list"],
  list: (filters) => [...boletasKeys.lists(), filters],

  details: () => [...boletasKeys.all, "detail"],
  detail: (id) => [...boletasKeys.details(), id],

  bySeguimiento: (idSeguimiento, periodo) => [
    ...boletasKeys.all,
    "seguimiento",
    idSeguimiento,
    periodo,
  ],
};