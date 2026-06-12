// apoyoKeys.js

export const apoyoKeys = {
  all: ["apoyos"],

  lists: () => [...apoyoKeys.all],

  list: (filtros) => [
    ...apoyoKeys.all,
    "list",
    filtros,
  ],

  details: () => [
    ...apoyoKeys.all,
    "detail",
  ],

  detail: (id) => [
    ...apoyoKeys.details(),
    id,
  ],
};