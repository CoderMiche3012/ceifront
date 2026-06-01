export const beneficiariosKeys = {
  all: ["beneficiarios"],
  list: () => [...beneficiariosKeys.all, "list"],
  detail: (id) => [...beneficiariosKeys.all, "detail", id],
  active: () => [...beneficiariosKeys.all, "active"],
};