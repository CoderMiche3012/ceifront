export const donativosKeys = {
  all: ["donativos"],

  // listado general
  list: () => [...donativosKeys.all, "list"],

  // detalle
  detail: (id) => [
    ...donativosKeys.all,
    "detail",
    id,
  ],

  // donativos de un donador en un periodo
  porDonadorPeriodo: (idDonador, idPeriodo) => [
    ...donativosKeys.all,
    "porDonadorPeriodo",
    idDonador,
    idPeriodo,
  ],

  // todos los donativos de un donador
  porDonador: (idDonador) => [
    ...donativosKeys.all,
    "porDonador",
    idDonador,
  ],

  // resumen por periodo
  resumen: (idPeriodo) => [
    ...donativosKeys.all,
    "resumen",
    idPeriodo,
  ],

  // NUEVA
  resumenPeriodo: (idPeriodo) => [
    ...donativosKeys.all,
    "resumenPeriodo",
    idPeriodo,
  ],

  // periodos válidos de un donador
  periodosDonador: (idDonador) => [
    ...donativosKeys.all,
    "periodosDonador",
    idDonador,
  ],

  // periodo activo
  periodoActivo: () => [
    ...donativosKeys.all,
    "periodoActivo",
  ],
};