export const familiaKeys = {
  all: ["familia"],

  lists: () => [
    ...familiaKeys.all,
    "list",
  ],

  list: (filters) => [
    ...familiaKeys.lists(),
    filters,
  ],

  detail: (id) => [
    ...familiaKeys.all,
    "detail",
    id,
  ],
};