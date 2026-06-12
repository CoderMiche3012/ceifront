export const obligacionesKeys = {
  all: ["obligaciones"],

  lists: () => [...obligacionesKeys.all, "list"],

  list: (filters) => [...obligacionesKeys.lists(), filters],

  details: () => [...obligacionesKeys.all, "detail"],

  detail: (id) => [...obligacionesKeys.details(), id],
};