import { User, PencilLine } from "lucide-react";
import { useState } from "react";
import { ui } from "../../../../styles/ui/index";

import Card from "../../../../components/ui/Card";

import BotonEditar from "../../../../components/ui/BotonEditar";
import EditarResumen from "../modales/EditarResumen";

export default function ResumenCard({ data = {}, canEdit}) {

  const [modalAbierto, setModalAbierto] = useState(false);
  // transformar fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "--";

    const [year, month, day] = fecha.split("-");
    const fechaLocal = new Date(year, month - 1, day);

    return fechaLocal.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  // calcular el tiempo en base a la fecha en que ingresaron
  const calcularTiempo = (fecha) => {
    if (!fecha) return "--";
    const [year, month, day] = fecha.split("-");
    const inicio = new Date(year, month - 1, day);
    const hoy = new Date();
    const hoyInclusivo = new Date(hoy);
    hoyInclusivo.setDate(hoyInclusivo.getDate() + 1);

    let años = hoyInclusivo.getFullYear() - inicio.getFullYear();
    let meses = hoyInclusivo.getMonth() - inicio.getMonth();
    let dias = hoyInclusivo.getDate() - inicio.getDate();

    if (dias < 0) {
      meses--;
      const ultimoMes = new Date(
        hoyInclusivo.getFullYear(),
        hoyInclusivo.getMonth(),
        0
      );
      dias += ultimoMes.getDate();
    }

    if (meses < 0) {
      años--;
      meses += 12;
    }

    return `${años > 0 ? años + " año" + (años !== 1 ? "s " : " ") : ""}${meses > 0 ? meses + " mes" + (meses !== 1 ? "es " : " ") : ""
      }${dias} día${dias !== 1 ? "s" : ""}`;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          Resumen
        </h3>
        {canEdit && (
          <BotonEditar icon={PencilLine} onClick={() => setModalAbierto(true)}>
            Editar datos
          </BotonEditar>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-6 text-sm">
        <div>
          <p className={ui.text.label}>
            Estatus
          </p>
          <p className="text-slate-700 font-medium">
            {data?.estatus || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>
            Fecha de ingreso
          </p>
          <p className="text-slate-700 font-medium">
            {formatearFecha(data?.fecha_ingreso)}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>
            Tiempo en el programa
          </p>
          <p className="text-slate-700 font-medium">
            {calcularTiempo(data?.fecha_ingreso)}
          </p>
        </div>
      </div>

      <EditarResumen
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
      />
    </Card>
  );
}
