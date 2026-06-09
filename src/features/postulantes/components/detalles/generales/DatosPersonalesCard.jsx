import { User, PencilLine } from "lucide-react";
import { useState } from "react";

import Card from "../../../../../components/ui/Card";
import BotonEditar from "../../../../../components/ui/BotonEditar";

import EditarDatosGenerales from "../../modales/EditarDatosGenerales";

import { ui } from "../../../../../styles/ui/index";

export default function DatosPersonalesCard({ data,canEdit }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  console.log(data)
  const gastoAlimentacion =
  data?.gastos?.find((g) => g.nombre === "Alimentacion")?.monto;

const gastoTransporte =
  data?.gastos?.find((g) => g.nombre === "Transporte")?.monto;
  console.log("t",gastoTransporte,gastoAlimentacion)

    const puedeEditar = canEdit && !["aceptado", "rechazado"].includes( data?.estatus_postulante?.toLowerCase() );


  return (
    <Card>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          Datos Personales
        </h3>

        {puedeEditar && (
          <BotonEditar
            icon={PencilLine}
            onClick={() => setModalAbierto(true)}
          >
            Editar datos
          </BotonEditar>
        )}

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">

        <div>
          <p className={ui.text.label}>Nombre completo</p>
          <p className="text-slate-700 font-medium">
            {data.nombre} {data.apellido_p} {data.apellido_m}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Fecha de nacimiento</p>
          <p className="text-slate-700 font-medium">
            {data.fecha_nacimiento || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Teléfono</p>
          <p className="text-slate-700 font-medium">
            {data.telefono || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Género</p>
          <p className="text-slate-700 font-medium">
            {data.genero || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Correo</p>
          <p className="text-slate-700 font-medium truncate">
            {data.correo || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Escolaridad</p>
          <p className="text-slate-700 font-medium">
            {data.nivel_escolar_inicial || "--"} | {data.grado_escolar_inicial || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Referencia de la casa</p>
          <p className="text-slate-700 font-medium">
            {data.referencia_casa || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Referencia de ingreso</p>
          <p className="text-slate-700 font-medium">
            {data.referencia_ingreso || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Nivel escolar inicial</p>
          <p className="text-slate-700 font-medium">
            {data.nivel_escolar_inicial || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Grado escolar inicial</p>
          <p className="text-slate-700 font-medium">
            {data.grado_escolar_inicial || "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Gasto de alimentación mensual</p>
          <p className="text-slate-700 font-medium">
            {gastoAlimentacion ?? "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>Gasto de transporte mensual</p>
          <p className="text-slate-700 font-medium">
            {gastoTransporte ?? "--"}
          </p>
        </div>

        <div>
          <p className={ui.text.label}>¿Cómo conoció el programa?</p>
          <p className="text-slate-700 font-medium">
            {data.referencia_ingreso || "--"}
          </p>
        </div>

      </div>


      {/* DIRECCIÓN */}
      <div className="mt-6 pt-4 border-t border-slate-100">

        <p className={ui.text.label}>Dirección</p>

        <p className="text-slate-700 font-medium leading-relaxed">
          Calle {data.calle}, #{data.numero}, Col. {data.colonia},{" "}
          {data.municipio}, C.P {data.cp}
        </p>
      </div>

      {/* MODAL */}

      <EditarDatosGenerales
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        postulante={data}
        onSuccess={() => {
          setModalAbierto(false);
        }}
      />
    </Card>
  );
}