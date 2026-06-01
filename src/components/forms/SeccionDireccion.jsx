import { useState } from "react";
import InputG from "../ui/InputG";
import Field from "../ui/Field";
import { buscarCPCompleto } from "../../features/expedientes/services/expedientesService";

export default function SeccionDireccion({ form, setForm }) {
  const [colonias, setColonias] = useState([]);
  const [cpEncontrado, setCpEncontrado] = useState(false);
  const [otraColonia, setOtraColonia] = useState(false);

  const inputClass =
    "h-9 text-sm rounded-lg border-slate-200 focus:ring-[#0E5F63]";

  const update = (field, value) => {
    setForm((p) => ({
      ...p,
      id_expediente: {
        ...p.id_expediente,
        id_direccion: {
          ...p.id_expediente.id_direccion,
          [field]: value,
        },
      },
    }));
  };

  const handleCP = async (cp) => {
    update("cp", cp);

    if (!/^\d{5}$/.test(cp)) {
      setColonias([]);
      update("municipio", "");
      update("colonia", "");
      setCpEncontrado(false);
      return;
    }

    try {
      const data = await buscarCPCompleto(cp);

      if (data?.municipio) {
        update("municipio", data.municipio);
        setCpEncontrado(true);
      }

      setColonias(data?.colonias || []);
    } catch {
      setColonias([]);
      setCpEncontrado(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">

      {/* CP */}
      <div className="col-span-2">
        <Field label="CP" required>
          <InputG
            className={inputClass}
            value={form.id_expediente.id_direccion.cp}
            onChange={(e) => handleCP(e.target.value)}
          />
        </Field>
      </div>

      {/* Municipio */}
      <div className="col-span-4">
        <Field label="Municipio" required>
          <InputG
            className={inputClass}
            disabled={cpEncontrado}
            value={form.id_expediente.id_direccion.municipio}
            onChange={(e) => update("municipio", e.target.value)}
          />
        </Field>
      </div>

      {/* Colonia */}
      <div className="col-span-4">
        <Field label="Colonia" required>
          {!otraColonia ? (
            <select
              className={inputClass}
              value={form.id_expediente.id_direccion.colonia}
              onChange={(e) => {
                if (e.target.value === "__otra__") {
                  setOtraColonia(true);
                  update("colonia", "");
                } else {
                  update("colonia", e.target.value);
                }
              }}
            >
              <option value="">Seleccionar...</option>
              {colonias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__otra__">Otra colonia</option>
            </select>
          ) : (
            <InputG
              className={inputClass}
              value={form.id_expediente.id_direccion.colonia}
              onChange={(e) => update("colonia", e.target.value)}
            />
          )}
        </Field>
      </div>

      {/* Número */}
      <div className="col-span-2">
        <Field label="Número" required>
          <InputG
            className={inputClass}
            value={form.id_expediente.id_direccion.numero}
            onChange={(e) => update("numero", e.target.value)}
          />
        </Field>
      </div>

      {/* Calle */}
      <div className="col-span-12">
        <Field label="Calle" required>
          <InputG
            className={inputClass}
            value={form.id_expediente.id_direccion.calle}
            onChange={(e) => update("calle", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}