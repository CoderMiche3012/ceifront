export const estudiosKeys = {
  all: ["estudios"],

  lists: () => [...estudiosKeys.all, "list"],

  list: (filters) => [
    ...estudiosKeys.lists(),
    filters,
  ],

  detail: (id) => [
    ...estudiosKeys.all,
    "detail",
    id,
  ],
};