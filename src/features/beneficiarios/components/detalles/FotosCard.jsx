import { useRef, useState, useEffect } from "react";
import {
  Camera,
  Plus,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Expand,
  Trash2,
} from "lucide-react";

import { useSubirFotografia, useEliminarFotografia } from "../../../expedientes/hooks/useFotografias";
import { ui } from "../../../../styles/ui/uiClasses";
import Input from "../../../../components/ui/Input";
import Field from "../../../../components/ui/Field";
import Boton from "../../../../components/ui/Boton";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { usePermissions } from "../../../../context/PermissionsContext";

export default function FotosCard({ data }) {

  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditPostulante = hasModulePermission("postulantes", "editar");
  const [showModal, setShowModal] = useState(false);
  const id_expediente = data?.id_expediente;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const { mutateAsync: subirFoto } = useSubirFotografia(id_expediente);
  const { mutateAsync: eliminarFoto } = useEliminarFotografia(id_expediente);

  const inputRef = useRef(null);
  const fotos = data?.fotografias?.filter((foto) => foto.etapa === "Inicial") || [];

  const [index, setIndex] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(null);
  useEffect(() => {
    if (index >= fotos.length && fotos.length > 0) {
      setIndex(fotos.length - 1);
    }

    if (fotos.length === 0) {
      setIndex(0);
    }
  }, [fotos.length, index]);
  const seleccionar = () => inputRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(file);
  };
  const cerrarResultado = () => {
    setResultado((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const cancelar = () => {
    setPreview(null);
    setDescripcion("");
    setShowModal(false);

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const confirmarSubida = async () => {
    if (!preview) return;

    if (!descripcion.trim()) {
      setResultado({
        open: true,
        type: "error",
        title: "Descripción requerida",
        message: "Debes capturar una descripción para la fotografía.",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("foto_archivo", preview);
      formData.append("id_expediente", id_expediente);
      formData.append("etapa", "Inicial");
      formData.append("descripcion", descripcion);

      await subirFoto(formData);

      cancelar();

      setResultado({
        open: true,
        type: "success",
        title: "Fotografía guardada",
        message: "La fotografía se guardó correctamente.",
      });
    } catch (error) {
      const mensaje =
        error?.errors?.foto_archivo?.[0] ||
        error?.original?.response?.data?.foto_archivo?.[0] ||
        error?.message ||
        "Error al subir fotografía";

      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: mensaje,
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async () => {
    try {
      const foto = modal?.fotos?.[modal?.index];

      if (!foto) return;

      await eliminarFoto(foto.id_foto);

      setShowDeleteConfirm(false);
      setModal(null);

      setResultado({
        open: true,
        type: "success",
        title: "Fotografía eliminada",
        message: "La fotografía se eliminó correctamente.",
      });
    } catch (e) {
      setShowDeleteConfirm(false);

      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: "No fue posible eliminar la fotografía.",
      });
    }
  };

  const next = () => {
    if (!fotos.length) return;
    setIndex((p) => (p + 1) % fotos.length);
  };

  const prev = () => {
    if (!fotos.length) return;
    setIndex((p) => (p - 1 + fotos.length) % fotos.length);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Camera size={18} />
          Fotos del expediente
        </h3>
        {canEditPostulante && (
          <button
            onClick={() => setShowModal(true)}
            className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* VIEWER */}
      <div className="relative h-64 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">

        {fotos.length === 0 ? (
          <div className="text-center p-6">
            <ImagePlus size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 font-semibold">Sin fotografías</p>
          </div>
        ) : (
          <>
            <img
              src={fotos[index].foto_archivo}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setModal({ fotos, index })}
            />

            {/* EXPAND */}
            <button
              onClick={() => setModal({ fotos, index })}
              className="absolute top-3 right-3 h-8 w-8 bg-black/40 text-white rounded-full flex items-center justify-center"
            >
              <Expand size={16} />
            </button>

            {/* NAV */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/40 text-white rounded-full"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/40 text-white rounded-full"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-2xl">
            <div className={ui.modal.formContainer}>

              <div className={ui.modal.formHeader}>
                <div
                  className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}
                >
                  <Camera size={24} />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>
                    Agregar Fotografía
                  </h2>

                  <p className={ui.modal.description}>
                    Adjunta una fotografía al expediente
                  </p>
                </div>

                <button
                  onClick={cancelar}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className={ui.modal.formBody}>
                <div className={ui.modal.formScroll}>
                  <div className="space-y-6">

                    {!preview ? (
                      <button
                        onClick={seleccionar}
                        className="
                            w-full border-2 border-dashed border-slate-300 rounded-2xl p-12 text-slate-500
                            hover:border-teal-500 hover:text-teal-600 transition
                          "
                      >
                        Seleccionar fotografía
                      </button>
                    ) : (
                      <img
                        src={URL.createObjectURL(preview)}
                        alt=""
                        className="w-full h-72 object-cover rounded-2xl border"
                      />
                    )}
                    <Field label="Descripción">

                      <Input
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción"
                      />
                    </Field>
                  </div>
                </div>

                <div className={ui.modal.formActions}>
                  <Boton
                    variant="secondary"
                    onClick={cancelar}
                  >
                    Cancelar
                  </Boton>

                  <Boton
                    onClick={() => setShowConfirm(true)}

                    disabled={!preview || loading}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Guardar Fotografía"
                    )}
                  </Boton>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" hidden onChange={onFile} />

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

          <button
            onClick={() => setModal(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X />
          </button>

          {canEditPostulante && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="absolute top-4 right-16 text-red-400"
            >
              <Trash2 />

            </button>
          )}
          <img
            src={modal?.fotos?.[modal?.index]?.foto_archivo}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
          />

          {modal.fotos.length > 1 && (
            <>
              <button
                onClick={() =>
                  setModal((p) => ({
                    ...p,
                    index:
                      (p.index - 1 + p.fotos.length) % p.fotos.length,
                  }))
                }
                className="absolute left-4 text-white"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                onClick={() =>
                  setModal((p) => ({
                    ...p,
                    index: (p.index + 1) % p.fotos.length,
                  }))
                }
                className="absolute right-4 text-white"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}
        </div>
      )}
      <ModalConfirmacion
        open={showConfirm}
        title="Guardar fotografía"
        description="¿Deseas guardar esta fotografía?"
        confirmText="Guardar"
        cancelText="Cancelar"
        color="teal"
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          setShowConfirm(false);
          await confirmarSubida();
        }}
      />
      <ModalConfirmacion
        open={showDeleteConfirm}
        title="Eliminar fotografía"
        description="¿Deseas eliminar esta fotografía?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="red"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={eliminar}
      />
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center min-w-[320px]">
            <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h3 className="font-semibold text-slate-800">
              Procesando Fotografia...
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Esto puede tardar unos segundos.
            </p>
          </div>
        </div>
      )}
      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={cerrarResultado}
      />
    </div>
  );
}


