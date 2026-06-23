import { useState, useEffect } from "react";
import { HiOutlineAcademicCap, HiOutlineX, HiOutlineUpload, HiOutlineDocumentText } from "react-icons/hi";
import { ui } from "../../../../../../styles/ui/index";

import Field from "../../../../../../components/ui/Field";
import Input from "../../../../../../components/ui/InputG";
import Boton from "../../../../../../components/ui/Boton";

import { useCrearBoleta, useActualizarBoleta, } from "../../../../hooks/seguimiento/useBoletas";
import { useSubirDocumento } from "../../../../../expedientes/hooks/useDocumentos";

import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";

export default function ModalBoleta({
  open,
  onClose,
  boleta,
  id_expediente,
}) {
  const crearBoleta = useCrearBoleta();
  const actualizarBoleta = useActualizarBoleta();
  const subirDocumento = useSubirDocumento();

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

  const estaCargando = crearBoleta.isPending || actualizarBoleta.isPending || subirDocumento.isPending;

  useEffect(() => {
    if (boleta) {
      setForm({
        promedio_boleta: boleta?.promedio_boleta || "",
        archivo: null,
      });
    }
  }, [boleta]);

  const limpiarNombreDocumento = (nombre) => {
    return nombre
      .replace(/\.[^/.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");
  };

  const handleGuardar = () => {
    const promedio = Number(form.promedio_boleta);

    if (!form.promedio_boleta) {
      setResultado({
        type: "warning",
        title: "Campo requerido",
        message: "Debes ingresar el promedio general.",
      });
      setOpenResult(true);
      return;
    }

    if (promedio < 1 || promedio > 10) {
      setResultado({
        type: "warning",
        title: "Promedio inválido",
        message: "El promedio debe estar en un rango de 1 a 10.",
      });
      setOpenResult(true);
      return;
    }

    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setOpenConfirm(false);

      let linkDocumento = boleta?.link || null;

      if (form.archivo) {
        const documentoData = new FormData();
        const nombreLimpio = limpiarNombreDocumento(form.archivo.name);

        documentoData.append("archivo", form.archivo);
        documentoData.append("nombre_documento", nombreLimpio);
        documentoData.append("tipo_documento", "Boleta");
        documentoData.append("id_expediente", id_expediente);

        const documento = await subirDocumento.mutateAsync(documentoData);
        linkDocumento = documento?.archivo || documento?.link || null;
      }

      const data = {
        tipo_boleta: "Boleta",
        periodo_boleta: boleta?.periodo_boleta,
        promedio_boleta: form.promedio_boleta,
        id_datos_escolares: boleta?.id_datos_escolares,
        link: linkDocumento,
      };

      const dataEditar = {
        promedio_boleta: form.promedio_boleta,
        link: linkDocumento,
      };

      if (boleta?.id_boleta) {
        await actualizarBoleta.mutateAsync({
          id: boleta.id_boleta,
          data: dataEditar,
        });
      } else {
        await crearBoleta.mutateAsync(data);
      }

      setResultado({
        type: "success",
        title: boleta?.id_boleta ? "Boleta Actualizada" : "Boleta Guardada",
        message: "La información del periodo se procesó correctamente.",
      });

      setOpenResult(true);
    } catch (error) {
      const mensaje =
        error?.errors?.archivo?.[0] ||
        error?.message ||
        "Error al subir documento";
      setResultado({
        type: "error",
        title: "Error al guardar",
        message: mensaje || "Ocurrió un problema, verifica los datos e intenta nuevamente.",
      });
      setOpenResult(true);
    }
  };

  const handleCloseResultado = () => {
    setOpenResult(false);
    if (resultado.type === "success") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <div className={ui.modal.formOverlay}>
        <div className="w-full max-w-2xl">
          <div className={ui.modal.formContainer}>

            <div className={ui.modal.formHeader}>
              <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
                <HiOutlineAcademicCap size={24} />
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>
                  {boleta?.id_boleta ? "Editar Boleta Escolar" : "Agregar Boleta Escolar"}
                </h2>
                <p className={ui.modal.description}>
                  Periodo actual: <span className="font-semibold text-slate-700">{boleta?.periodo_boleta || "N/A"}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <div className={ui.modal.formBody}>
              <div className={ui.modal.formScroll}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                  <Field label="Promedio General" required>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      step="0.01"
                      placeholder="Ej. 9.35"
                      value={form.promedio_boleta}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          promedio_boleta: e.target.value,
                        })
                      }
                    />
                  </Field>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Documento Digital
                    </span>

                    <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-5 text-center bg-slate-50/50 transition relative group">
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file && file.type !== "application/pdf") {
                            setResultado({
                              type: "warning",
                              title: "Archivo no válido",
                              message: "Solo se permiten archivos PDF.",
                            });
                            setOpenResult(true);
                            return;
                          }

                          setForm({
                            ...form,
                            archivo: file || null,
                          });
                        }}
                        className="hidden"
                        id="fileInput"
                      />

                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                      >
                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:text-teal-600 transition">
                          <HiOutlineUpload size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 group-hover:text-teal-600 transition">
                          {form.archivo ? "Cambiar archivo seleccionado" : "Examinar o subir archivo"}
                        </span>
                        <span className="text-xs text-slate-400">
                          Formatos aceptados: PDF, JPG, PNG
                        </span>
                      </label>
                    </div>

                    {form.archivo && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-100 rounded-xl text-teal-700 text-xs font-medium">
                        <HiOutlineDocumentText size={16} className="shrink-0 text-teal-600" />
                        <span className="truncate flex-1">{form.archivo.name}</span>
                      </div>
                    )}

                    {!form.archivo && boleta?.link && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs font-medium">
                        <HiOutlineDocumentText size={16} className="shrink-0 text-slate-400" />
                        <span className="truncate flex-1">Documento actual cargado</span>
                        <a
                          href={boleta.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:text-teal-700 font-bold hover:underline"
                        >
                          Ver
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className={ui.modal.formActions}>
                <Boton
                  variant="secondary"
                  onClick={onClose}
                  disabled={estaCargando}
                >
                  Cancelar
                </Boton>

                <Boton
                  onClick={handleGuardar}
                  disabled={estaCargando}
                >
                  {estaCargando ? "Procesando..." : "Guardar Cambios"}
                </Boton>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
        loading={estaCargando}
        color="teal"
        title={boleta?.id_boleta ? "Actualizar Boleta" : "Registrar Boleta"}
        description={`¿Estás seguro de que deseas guardar la información y los archivos asignados para el ${boleta?.periodo_boleta || "periodo"}?`}
      />
      {estaCargando && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center min-w-[320px]">

            <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h3 className="font-semibold text-slate-800">
              Procesando documento...
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Esto puede tardar unos segundos.
            </p>

          </div>

        </div>
      )}
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


