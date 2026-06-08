import { useState, useEffect } from "react";
import { ui } from "../../../../styles/ui/index";

import Field from "../../../../components/ui/Field";
import Input from "../../../../components/ui/InputG";

export const FormAgendar = ({ data, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <Field label="Fecha de visita" required>
      <Input
        type="date"
        value={data.fecha || ""}
        onChange={(e) =>
          onChange({ ...data, fecha: e.target.value })
        }
      />
    </Field>

    <Field label="Hora" required>
      <Input
        type="time"
        value={data.hora || ""}
        onChange={(e) =>
          onChange({ ...data, hora: e.target.value })
        }
      />
    </Field>

  </div>
);

export const FormFinalizar = ({ data, onChange }) => (
  <Field label="Notas del resultado">
    <textarea
      rows={4}
      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
      placeholder="Escribe las observaciones de la visita..."
      value={data.nota || ""}
      onChange={(e) =>
        onChange({ ...data, nota: e.target.value })
      }
    />
  </Field>
);

export const FormCancelar = ({ data, onChange }) => (
  <Field label="Motivo de cancelación">
    <textarea
      rows={4}
      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
      placeholder="Escribe el motivo de la cancelación..."
      value={data.nota || ""}
      onChange={(e) =>
        onChange({ ...data, nota: e.target.value })
      }
    />
  </Field>
);