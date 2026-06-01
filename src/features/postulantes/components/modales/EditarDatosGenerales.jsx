import { useEffect, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import InputG from "../../../../components/ui/InputG";
import Select from "../../../../components/ui/Select";
import Field from "../../../../components/ui/Field";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import {
  actualizarExpediente,
  actualizarDireccion,
  buscarCPCompleto
} from "../../../expedientes/services/expedientesService";

import { actualizarEstudio } from "../../services/estudiosService";
import { formatErrorAnidado } from "../../../../utils/errorHandlers";

const getErrorMessage = (err) => {
  if (err?.response?.data) return formatErrorAnidado(err.response.data);
  if (err?.message) return formatErrorAnidado(err);
  return "Error inesperado";
};

export default function EditarDatosGenerales({ isOpen, onClose, data }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: ""
  });

  const [form, setForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    telefono: "",
    correo: "",
    fecha_nacimiento: "",
    genero: "",

    nivel_escolar_inicial: "",
    grado_escolar_inicial: "",
    referencia_ingreso: "",
    referencia_casa: "",

    calle: "",
    numero: "",
    colonia: "",
    municipio: "",
    cp: ""
  });

  const [colonias, setColonias] = useState([]);
  const [loadingCP, setLoadingCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] = useState(false);
  const [otraColonia, setOtraColonia] = useState(false);

  // =========================
  // INIT DATA
  // =========================
  useEffect(() => {
    if (!isOpen || !data) return;

    setForm({
      nombre: data.nombre || "",
      apellido_p: data.apellido_p || "",
      apellido_m: data.apellido_m || "",
      telefono: data.telefono || "",
      correo: data.correo || "",
      fecha_nacimiento: data.fecha_nacimiento || "",
      genero: data.genero || "",

      nivel_escolar_inicial: data.nivel_escolar_inicial || "",
      grado_escolar_inicial: data.grado_escolar_inicial || "",
      referencia_ingreso: data.referencia_ingreso || "",
      referencia_casa: data.referencia_casa || "",

      calle: data.calle || "",
      numero: data.numero || "",
      colonia: data.colonia || "",
      municipio: data.municipio || "",
      cp: data.cp || ""
    });

    setOtraColonia(false);
    setColonias([]);
    setCpEncontrado(false);

    const cargarCP = async () => {
      if (!data?.cp || String(data.cp).length !== 5) return;

      try {
        setLoadingCP(true);

        const res = await buscarCPCompleto(data.cp);

        setColonias(res?.colonias || []);

        if (res?.municipio) {
          setCpEncontrado(true);
          setForm((prev) => ({
            ...prev,
            municipio: res.municipio
          }));
        }

        if (
          data?.colonia &&
          res?.colonias &&
          !res.colonias.includes(data.colonia)
        ) {
          setOtraColonia(true);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingCP(false);
      }
    };

    cargarCP();
  }, [isOpen, data]);

  if (!isOpen) return null;

  // =========================
  // HELPERS
  // =========================
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSave = async () => {
    setLoading(true);

    try {
      const { id_expediente, id_direccion, id_estudio } = data;

      await Promise.all([
        actualizarExpediente(id_expediente, {
          nombre: form.nombre,
          apellido_p: form.apellido_p,
          apellido_m: form.apellido_m,
          telefono: form.telefono,
          correo: form.correo,
          fecha_nacimiento: form.fecha_nacimiento,
          genero: form.genero
        }),

        actualizarDireccion(id_direccion, {
          calle: form.calle,
          numero: form.numero,
          colonia: form.colonia,
          municipio: form.municipio,
          cp: form.cp
        }),

        actualizarEstudio(id_estudio, {
          nivel_escolar_inicial: form.nivel_escolar_inicial,
          grado_escolar_inicial: form.grado_escolar_inicial,
          referencia_ingreso: form.referencia_ingreso,
          referencia_casa: form.referencia_casa
        })
      ]);

      setResultado({
        open: true,
        type: "success",
        title: "Actualización exitosa",
        message: "Los datos se actualizaron correctamente"
      });

      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);

      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: getErrorMessage(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">

        <div className="bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center justify-between p-8 bg-white border-b">
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                Editar Expediente
              </h2>
              <p className="text-sm text-slate-500">
                Actualiza la información del beneficiario
              </p>
            </div>

            <button onClick={onClose}>
              <X className="text-slate-400" />
            </button>
          </div>

          {/* FORM */}
          <div className="p-8 max-h-[70vh] overflow-y-auto space-y-10">

            {/* INFO PERSONAL */}
            <section>
              <h3 className="text-xs font-black text-[#0E5F63] mb-4">
                Información Personal
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nombre">
                  <InputG value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
                </Field>

                <Field label="Apellido Paterno">
                  <InputG value={form.apellido_p} onChange={(e) => update("apellido_p", e.target.value)} />
                </Field>

                <Field label="Apellido Materno">
                  <InputG value={form.apellido_m} onChange={(e) => update("apellido_m", e.target.value)} />
                </Field>

                <Field label="Teléfono">
                  <InputG value={form.telefono} onChange={(e) => update("telefono", e.target.value)} />
                </Field>

                <Field label="Correo">
                  <InputG value={form.correo} onChange={(e) => update("correo", e.target.value)} />
                </Field>
              </div>
            </section>

            {/* DIRECCIÓN */}
            <section>
              <h3 className="text-xs font-black text-[#0E5F63] mb-4">
                Dirección
              </h3>

              <div className="grid md:grid-cols-3 gap-4">

                <Field label="CP">
                  <InputG
                    value={form.cp}
                    onChange={async (e) => {
                      const cp = e.target.value;
                      update("cp", cp);

                      if (!/^\d{5}$/.test(cp)) return;

                      const res = await buscarCPCompleto(cp);
                      setColonias(res?.colonias || []);

                      if (res?.municipio) {
                        setCpEncontrado(true);
                        update("municipio", res.municipio);
                      }
                    }}
                  />
                </Field>

                <Field label="Municipio">
                  <InputG
                    value={form.municipio}
                    disabled={cpEncontrado}
                    onChange={(e) => update("municipio", e.target.value)}
                  />
                </Field>

                <Field label="Colonia">
                  {!otraColonia ? (
                    <Select
                      value={form.colonia}
                      onChange={(e) => update("colonia", e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      {colonias.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__otra__">Otra</option>
                    </Select>
                  ) : (
                    <InputG
                      value={form.colonia}
                      onChange={(e) => update("colonia", e.target.value)}
                    />
                  )}
                </Field>

                <Field label="Calle">
                  <InputG value={form.calle} onChange={(e) => update("calle", e.target.value)} />
                </Field>

                <Field label="Número">
                  <InputG value={form.numero} onChange={(e) => update("numero", e.target.value)} />
                </Field>
              </div>
            </section>

            {/* ACADÉMICO */}
            <section>
              <h3 className="text-xs font-black text-[#0E5F63] mb-4">
                Estudios
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nivel">
                  <Select
                    value={form.nivel_escolar_inicial}
                    onChange={(e) => update("nivel_escolar_inicial", e.target.value)}
                  >
                    <option>Primaria</option>
                    <option>Secundaria</option>
                    <option>Bachillerato</option>
                  </Select>
                </Field>

                <Field label="Grado">
                  <InputG value={form.grado_escolar_inicial} onChange={(e) => update("grado_escolar_inicial", e.target.value)} />
                </Field>
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-4 p-6 border-t bg-white">
            <button onClick={onClose} className="px-6 py-2 text-slate-500">
              Cancelar
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-2 bg-[#0E5F63] text-white rounded-xl flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM */}
      <ModalConfirmacion
        open={showConfirm}
        title="Confirmar cambios"
        message="Se actualizará el expediente"
        onConfirm={handleSave}
        onClose={() => setShowConfirm(false)}
      />

      {/* RESULT */}
      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() => {
          setResultado((p) => ({ ...p, open: false }));
          if (resultado.type === "success") onClose();
        }}
      />
    </>
  );
}