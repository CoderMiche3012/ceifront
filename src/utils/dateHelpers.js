export const generarSemanasLaborales = (fechaInicio, fechaFin) => {
  const inicioPeriodo = new Date(`${fechaInicio}T00:00:00`);
  const finPeriodo = new Date(`${fechaFin}T23:59:59`);

  if (isNaN(inicioPeriodo) || isNaN(finPeriodo)) return [];

  const semanas = [];
  let actual = new Date(inicioPeriodo);

  const diaSemana = actual.getDay(); // 0 es domingo, 1 lunes...
  const diffAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  actual.setDate(actual.getDate() + diffAlLunes);

  // Generar semanas mientras el lunes actual no supere el fin del periodo
  while (actual <= finPeriodo) {
    const lunes = new Date(actual);
    const viernes = new Date(actual);
    viernes.setDate(actual.getDate() + 4);

    semanas.push({
      inicio: lunes.toLocaleDateString("en-CA"),
      fin: viernes.toLocaleDateString("en-CA"),
    });

    actual.setDate(actual.getDate() + 7);
  }

  return semanas;
};