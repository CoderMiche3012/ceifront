export const donadoresKeys = {
  all: ["donadores"],
  list: () => [...donadoresKeys.all, "list"],
  detail: (id) => [
    ...donadoresKeys.all,
    "detail",
    id,
  ],
};