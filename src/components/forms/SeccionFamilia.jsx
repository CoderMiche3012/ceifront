import InputG from "../ui/InputG";
import Field from "../ui/Field";
import { HiPlus, HiTrash } from "react-icons/hi";



export default function SeccionFamilia({ form, setForm }) {
  const inputClass =
    "h-9 text-sm rounded-lg border-slate-200 focus:ring-[#0E5F63]";

  const update = (i, field, value) => {
    const nueva = [...form.id_expediente.familia];
    nueva[i][field] = value;

    setForm((p) => ({
      ...p,
      id_expediente: {
        ...p.id_expediente,
        familia: nueva,
      },
    }));
  };

  return (
    <div className="space-y-4">

      {form.id_expediente.familia.map((fam, i) => (
        <div key={i} className="p-5 border rounded-2xl bg-white">

          <div className="flex justify-between mb-4">
            <span className="text-xs font-bold">
              {fam.es_tutor_principal ? "Tutor" : `Integrante ${i + 1}`}
            </span>

            {i > 0 && (
              <button
                type="button"
                onClick={() => {
                  const n = form.id_expediente.familia.filter((_, idx) => idx !== i);

                  setForm((p) => ({
                    ...p,
                    id_expediente: {
                      ...p.id_expediente,
                      familia: n,
                    },
                  }));
                }}
              >
                <HiTrash />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">

            <Field label="Nombre">
              <InputG value={fam.nombre} onChange={(e) => update(i, "nombre", e.target.value)} />
            </Field>

            <Field label="Ap. Paterno">
              <InputG value={fam.apellido_p} onChange={(e) => update(i, "apellido_p", e.target.value)} />
            </Field>

            <Field label="Ap. Materno">
              <InputG value={fam.apellido_m} onChange={(e) => update(i, "apellido_m", e.target.value)} />
            </Field>

            <Field label="Parentesco">
              <InputG value={fam.parentesco} onChange={(e) => update(i, "parentesco", e.target.value)} />
            </Field>

            <Field label="Teléfono">
              <InputG value={fam.telefono} onChange={(e) => update(i, "telefono", e.target.value)} />
            </Field>

            <Field label="Actividad">
              <InputG value={fam.actividad_principal} onChange={(e) => update(i, "actividad_principal", e.target.value)} />
            </Field>

            <Field label="Salario">
              <InputG value={fam.salario} onChange={(e) => update(i, "salario", e.target.value)} />
            </Field>

          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          setForm((p) => ({
            ...p,
            id_expediente: {
              ...p.id_expediente,
              familia: [
                ...p.id_expediente.familia,
                {
                  nombre: "",
                  apellido_p: "",
                  apellido_m: "",
                  parentesco: "",
                  salario: "0.00",
                  telefono: "",
                  es_tutor_principal: false,
                },
              ],
            },
          }));
        }}
        className="text-sm text-[#0E5F63]"
      >
        <HiPlus /> Agregar familiar
      </button>

    </div>
  );
}