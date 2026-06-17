
export const seguimientosKeys =
{
  all: ["seguimientos"],
  lists: () => [...seguimientosKeys.all, "list",],
  active: () => [...seguimientosKeys.all, "active"],

  detail: (id) => [...seguimientosKeys.all, "detail", id],

  byBeneficiario: (id_beneficiario) => [
    ...seguimientosKeys.all,
    "beneficiario",
    id_beneficiario,
  ],

  byPeriodo: ({ id_beneficiario, id_periodo, }) => [
    ...seguimientosKeys.all,
    "periodo",
    id_beneficiario,
    id_periodo,
  ],
};
