export const beneficiariosKeys = {
  all: ["beneficiarios"],

  list: () => [...beneficiariosKeys.all, "list"],

  detail: (id) => [...beneficiariosKeys.all, "detail", id],

  active: () => [...beneficiariosKeys.all, "active"],

  byPeriodo: (periodo) => [
    ...beneficiariosKeys.all,
    "periodo",
    periodo,
  ],

  lastByPeriod: () => [
    ...beneficiariosKeys.all,
    "ultimo-periodo",
  ],
};