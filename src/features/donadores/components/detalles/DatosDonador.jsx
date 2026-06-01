import { User } from "lucide-react";
import { useState } from "react";
import { PencilLine } from "lucide-react";
import { ui } from "../../../../styles/ui/uiClasses";

import Card from "../../../../components/ui/Card";
import EditarDatosGenerales from "./../modales/EditarDatosGenerales";
import BotonEditar from "../../../../components/ui/BotonEditar";

export default function DatosDonador({ data, setData }) {
  // estado local
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          Datos del Donador
        </h3>

        <BotonEditar icon={PencilLine} onClick={() => setModalAbierto(true)}>
          Editar datos
        </BotonEditar>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <div>
          <p className={ui.text.label}>
            Nombre
          </p>
          <p className="text-slate-700 font-medium truncate">
            {data.nombre} {data.apellido_p} {data.apellido_m}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>
            Correo
          </p>
          <p className="text-slate-700 font-medium truncate">
            {data.correo || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>
            Teléfono
          </p>
          <p className="text-slate-700 font-medium">
            {data.telefono || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>
            Tipo
          </p>
          <p className="text-slate-700 font-medium">
            {data.tipo || "--"}
          </p>
        </div>
      </div>

      {/* Dirección  */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className={ui.text.label}>
          Dirección
        </p>
        <p className="text-slate-700 font-medium leading-relaxed">
          Calle {data.calle}, #{data.numero}, Col. {data.colonia},{" "}
          {data.municipio}, {data.localidad}, {data.pais}, C.P {data.cp}
        </p>
      </div>

      <EditarDatosGenerales
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        donador={data}
        onSuccess={(nuevo) =>
          setData((prev) => ({
            ...prev,
            ...nuevo,
          }))
        }
      />
    </Card>
  );
}
