export const datosEscolaresKeys = {
  all: ["datosEscolares"],

  list: () => [...datosEscolaresKeys.all, "list"],

  detail: (id) => [...datosEscolaresKeys.all, "detail", id],

  bySeguimiento: (id_seguimiento) => [
    ...datosEscolaresKeys.all,
    "seguimiento",
    id_seguimiento,
  ],
};