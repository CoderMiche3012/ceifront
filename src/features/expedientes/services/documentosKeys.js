export const documentosKeys = {
  all: ["documentos-personales"],

  // lista general de documentos
  list: () => ["documentos-personales", "list"],

  // detalle de un documento
  detail: (idDocumento) => [
    "documentos-personales",
    "detail",
    idDocumento,
  ],
};