export const fotografiasKeys = {
  all: ["fotografias"],

  lists: () => [...fotografiasKeys.all, "list"],

  list: (filters) => [...fotografiasKeys.lists(), filters],

  detail: (id) => [...fotografiasKeys.all, "detail", id],

  expediente: (idExpediente) => [
    ...fotografiasKeys.all,
    "expediente",
    idExpediente,
  ],
};