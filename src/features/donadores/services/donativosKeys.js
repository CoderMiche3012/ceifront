export const donativosKeys = {
  all: ["donativos"],
  list: () => [...donativosKeys.all, "list"],
  detail: (id) => [
    ...donativosKeys.all,
    "detail",
    id,
  ],
  conPeriodo: () => [
    ...donativosKeys.all,
    "conPeriodo",
  ],
};