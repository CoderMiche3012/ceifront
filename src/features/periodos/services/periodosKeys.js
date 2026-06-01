export const periodosKeys = {
  all: ["periodos"],
  list: () => [...periodosKeys.all, "list"],
  active: () => [...periodosKeys.all, "active"],
};