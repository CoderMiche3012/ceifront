import { User, PencilLine } from "lucide-react";
import { useState } from "react";

import { ui } from "../../../../styles/ui/index";

import Card from "../../../../components/ui/Card";
import EditarDatosGenerales from "./../modales/EditarDatosGenerales";
import BotonEditar from "../../../../components/ui/BotonEditar";

export default function DatosDonador({ data, canEdit }) {

  // estado local
  const [modalAbierto, setModalAbierto] = useState(false);
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          Datos del Donador
        </h3>
        {canEdit && (
          <BotonEditar icon={PencilLine} onClick={() => setModalAbierto(true)}>
            Editar datos
          </BotonEditar>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <div>
          <p className={ui.text.label}>
            Nombre
          </p>
          <p className="text-slate-700 font-medium truncate">
            {data.nombre} {data.apellido_paterno} {data.apellido_materno}
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
            {data.tipo_donador || "--"}
          </p>
        </div>
      </div>

      {/* Dirección  */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className={ui.text.label}>
          Dirección
        </p>
        <p className="text-slate-700 font-medium leading-relaxed">
          Calle {data.domicilio_detalle?.calle}, #{data.domicilio_detalle?.numero}, {data.domicilio_detalle?.geografia_detalle?.municipio},
          {data.domicilio_detalle?.geografia_detalle?.estado},{data.domicilio_detalle?.geografia_detalle?.pais}, C.P {data.domicilio_detalle?.geografia_detalle?.codigo_postal}
        </p>
      </div>

      <EditarDatosGenerales
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        donador={data}
        onSuccess={() => {
          console.log("onSuccess ejecutado");
          setModalAbierto(false);
        }}
      />
    </Card>
  );
}
