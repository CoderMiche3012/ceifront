import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearBoleta, actualizarBoleta, } from "../../../../services/boletasService";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";


export default function ModalBoleta({ open, onClose, boleta }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    promedio_boleta: "",
    archivo: null,
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openResult, setOpenResult] = useState(false);

  const [resultado, setResultado] = useState({
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (boleta) {
      setForm({
        promedio_boleta: boleta?.promedio_boleta || "",
        archivo: null,
      });
    }
  }, [boleta]);

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("tipo_boleta", boleta?.tipo_boleta);
    formData.append("periodo_boleta", boleta?.periodo_boleta);
    formData.append("promedio_boleta", form.promedio_boleta);
    formData.append("id_datos_escolares", boleta?.id_datos_escolares);
    if (form.archivo) {
      formData.append("archivo", form.archivo);
    }
    return formData;
  };

  const mutation = useMutation({
    mutationFn: () => {
      const data = buildFormData();

      if (boleta?.id_boleta) {
        return actualizarBoleta(boleta.id_boleta, data);
      }

      return crearBoleta(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["seguimiento"]);

      setResultado({
        type: "success",
        title: "Boleta guardada",
        message: "La información se actualizó correctamente.",
      });

      setOpenResult(true);
    },

    onError: () => {
      setResultado({
        type: "error",
        title: "Error al guardar",
        message: "Intenta nuevamente o verifica los datos.",
      });

      setOpenResult(true);
    },
  });

  if (!open) return null;

  const handleGuardar = () => {
    const promedio = Number(form.promedio_boleta);
    if (!form.promedio_boleta) {
      setResultado({
        type: "warning",
        title: "Campo requerido",
        message: "Debes ingresar el promedio.",
      });
      setOpenResult(true);
      return;
    }
    if (promedio < 1 || promedio > 10) {
      setResultado({
        type: "warning",
        title: "Promedio inválido",
        message: "El promedio debe estar entre 1 y 10.",
      });
      setOpenResult(true);
      return;
    }
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    mutation.mutate();
  };

  const handleCloseResultado = () => {
    setOpenResult(false);
    if (resultado.type === "success") {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">
              {boleta?.id_boleta ? "Editar boleta" : "Agregar boleta"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Captura el promedio y adjunta la boleta
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Promedio general
              </label>

              <input
                type="number"
                placeholder="Ej. 9.5"
                min="1"
                max="10"
                step="0.01"
                value={form.promedio_boleta}
                onChange={(e) =>
                  setForm({
                    ...form,
                    promedio_boleta: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-slate-300 px-0 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-teal-400 transition">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                Archivo adjunto
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) =>
                  setForm({
                    ...form,
                    archivo: e.target.files[0],
                  })
                }
                className="hidden"
                id="fileInput"
              />

              <label
                htmlFor="fileInput"
                className="cursor-pointer text-sm text-slate-600"
              >
                Haz clic para subir archivo
              </label>

              {form.archivo && (
                <p className="mt-3 text-sm text-teal-600 font-medium truncate">
                  {form.archivo.name}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={mutation.isLoading}
              className="
    text-sm px-4 py-2 
    rounded-lg 
    bg-white 
    text-slate-600 
    border border-slate-300
    hover:bg-slate-100 
    hover:text-slate-800
    transition
    disabled:opacity-50
  "
            >
              Cancelar
            </button>

            <button
              onClick={handleGuardar}
              disabled={mutation.isLoading}
              className="text-sm px-4 py-2 bg-teal-600 text-white rounded-lg 
              hover:bg-teal-700 disabled:opacity-60"
            >
              {mutation.isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMACIÓN */}
      <ModalConfirmacion
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
        title={boleta?.id_boleta ? "Actualizar boleta" : "Guardar boleta"}
        description="Se guardará el promedio y el archivo (si se adjunta). ¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={mutation.isLoading}
        color="teal"
      />

      {/* RESULTADO */}
      <ModalResultado
        open={openResult}
        onClose={handleCloseResultado}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
      />
    </>
  );
}
