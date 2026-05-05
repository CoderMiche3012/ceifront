import { useState } from "react";
import { X } from "lucide-react";

import Boton from "../../../../ui/Boton";
import Field from "../../../../ui/Field";
import Input from "../../../../ui/Input";
import Alerta from "../../../../ui/AlertaError";
import ModalResultado from "../../../../shared/ModalResultado";
import ModalConfirmacion from "../../../../shared/ModalConfirmacion";

import useDatosEscolares from "../../../../../hooks/beneficiarios/seguimiento/useDatosEscolares";
import EscuelaSelector from "./EscuelaSelector";
import EscolaridadSelector from "./EscolaridadSelector";

export default function ModalDatosEscolares({
  open,
  onClose,
  id_seguimiento,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultadoOpen, setResultadoOpen] = useState(false);

  const datos = useDatosEscolares(id_seguimiento);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl">

        <div className="flex justify-between">
          <h2>Datos escolares</h2>
          <X onClick={onClose} />
        </div>

        <Alerta mensaje={datos.error} />

        <Field label="Escuela" required>
          <EscuelaSelector {...datos} />
        </Field>

        <Field label="Escolaridad" required>
          <EscolaridadSelector {...datos} />
        </Field>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Field label="Grupo">
            <Input name="grupo" onChange={datos.handleChange} />
          </Field>

          <Field label="Turno">
            <Input name="turno" onChange={datos.handleChange} />
          </Field>

          <Field label="Modalidad">
            <Input
              name="modalidad_educativa"
              onChange={datos.handleChange}
            />
          </Field>

          <Field label="Especialidad">
            <Input
              name="especialidad"
              onChange={datos.handleChange}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Boton onClick={onClose}>Cancelar</Boton>
          <Boton onClick={() => setConfirmOpen(true)}>
            Guardar
          </Boton>
        </div>
      </div>

      <ModalConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          const ok = await datos.handleSubmit();
          if (ok) {
            setConfirmOpen(false);
            setResultadoOpen(true);
          }
        }}
      />

      <ModalResultado
        open={resultadoOpen}
        onClose={() => {
          setResultadoOpen(false);
          onClose();
        }}
      />
    </div>
  );
}