export const usuariosKeys = {
  all: ["usuarios"],
  lists: () => [...usuariosKeys.all, "list"],
  list: (filters) => [ ...usuariosKeys.lists(), filters,],
  detail: (id) => [ ...usuariosKeys.all, "detail", id, ],
};