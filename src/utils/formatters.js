
export const calcularEdad = (fecha) => {
  if (!fecha) return "--";

  const hoy = new Date();
  const nacimiento = new Date(fecha);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};

export const getEstatusInfo = (estatusRaw) => {
  const estatus = String(estatusRaw || "").toLowerCase();

  switch (estatus) {
    case "activo":
      return { text: "Activo", className: "bg-green-100 text-green-600" };
    case "inactivo":
      return { text: "Inactivo", className: "bg-red-100 text-red-600" };
    case "pausa":
      return { text: "En Pausa", className: "bg-red-100 text-red-600" };
    default:
      return { text: "Sin estatus", className: "bg-slate-100 text-slate-500" };
  }
};