export const postulantesKeys = {
  all: ["postulantes"],

  lists: () => [...postulantesKeys.all, "list"],

  list: (filters) => [
    ...postulantesKeys.lists(),
    filters,
  ],

  detail: (id) => [
    ...postulantesKeys.all,
    "detail",
    id,
  ],
};