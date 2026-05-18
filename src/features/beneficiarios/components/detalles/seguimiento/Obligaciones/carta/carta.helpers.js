export const initialPayload = (idSeguimiento) => ({
  id_servicio_social: null,
  id_seguimiento: idSeguimiento,
  tipo: "carta",
  estatus: "Pendiente",
  fecha: "",
  observaciones: "",
});

export const normalizarFecha = (fecha) => {
  if (!fecha) return "";
  return String(fecha).split("T")[0];
};

export const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";
  const limpia = normalizarFecha(fecha);
  const [y, m, d] = limpia.split("-");
  if (!y || !m || !d) return "Sin fecha";
  return `${d}/${m}/${y}`;
};

export const obtenerBadge = (estatus) => {
  switch (estatus?.toLowerCase()) {
    case "cumplio":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "no cumplio":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-amber-50 text-amber-700 border border-amber-200";
  }
};

