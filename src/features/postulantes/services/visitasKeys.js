export const visitasKeys = {
  all: ["visitas"],
  lists: () => [...visitasKeys.all, "list"],

  list: (filters) => [
    ...visitasKeys.lists(),
    filters,
  ],

  detail: (id) => [
    ...visitasKeys.all,
    "detail",
    id,
  ],
};