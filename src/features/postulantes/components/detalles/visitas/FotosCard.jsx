import { useRef, useState } from "react";
import { Trash2, Camera, Plus, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { HiOutlineX } from "react-icons/hi";
import { useSubirFotografia } from "../../../hooks/useSubirFotografia";
import { ui } from "../../../../../styles/ui/index";
import Field from "../../../../../components/ui/Field";
import Input from "../../../../../components/ui/Input";
import Boton from "../../../../../components/ui/Boton";
import ModalConfirmacion from "../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../components/shared/ModalResultado";
import { useEliminarFotografia } from "../../../../expedientes/hooks/useFotografias";

export default function FotosCard({ data }) {
  const { mutateAsync: eliminarFoto } =
    useEliminarFotografia(
      data.id_expediente,
      data.id_postulante
    );

  const fotos = data?.fotografias || [];
  console.log(fotos)

  const [index, setIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    inputRef,
    descripcion,
    setDescripcion,
    preview,
    showModal,
    setShowModal,
    seleccionar,
    subirFotos,
    confirmarSubida,
    limpiar,

    showConfirm,
    setShowConfirm,

    resultado,
      setResultado,
    cerrarResultado,
  } = useSubirFotografia(data.id_expediente);
  const eliminarFotografiaActual = async () => {
    try {
      await eliminarFoto(fotos[index].id_foto);

      setShowDeleteConfirm(false);

      if (index > 0 && index >= fotos.length - 1) {
        setIndex(index - 1);
      }

      setResultado({
        open: true,
        type: "success",
        title: "Fotografía eliminada",
        message: "La fotografía se eliminó correctamente.",
      });
    } catch (error) {
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
    setIndex((prev) => (prev + 1) % fotos.length);
  };

  const prev = () => {
    if (!fotos.length) return;
    setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow border border-slate-200 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Camera size={18} />
          Fotos del expediente
        </h3>

        <button
          onClick={() => setShowModal(true)}
          className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center hover:scale-105 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* VIEWER */}
      <div className="relative rounded-2xl border border-slate-200 overflow-hidden min-h-[280px] bg-slate-50 flex items-center justify-center">
       
        {/* NAV */}
        {fotos.length > 0 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
            >
              <ChevronRight size={16} />
            </button>

            {/* INDICADOR */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
              {index + 1} / {fotos.length}
            </div>
          </>
        )}

        {/* EMPTY */}
        {fotos.length === 0 ? (
          <div className="text-center p-6">
            <ImagePlus size={40} className="mx-auto text-slate-400 mb-2" />
            <p className="text-slate-500 font-medium">Sin fotos aún</p>
          </div>
        ) : (
          <img
            src={`http://localhost:8000${fotos[index].foto_archivo}`}

            className="w-full h-full object-cover"
          />
        )}
      </div>
      {fotos.length > 0 && (
        <div className="rounded-xl bg-slate-50 px-4 py-3 border border-slate-100 flex items-center justify-between">
  <p className="text-sm text-slate-700">
    {fotos[index].descripcion || "Sin descripción"}
  </p>

  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="
      p-2 rounded-lg
      text-slate-400
      hover:text-red-600
      hover:bg-red-50
      transition
    "
  >
    <Trash2 size={16} />
  </button>
</div>
      )}
      {showModal && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-2xl">
            <div className={ui.modal.formContainer}>

              {/* HEADER */}
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
                  onClick={limpiar}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              {/* BODY */}
              <div className={ui.modal.formBody}>
                <div className={ui.modal.formScroll}>
                  <div className="space-y-6">

                    {!preview ? (
                      <button
                        onClick={seleccionar}
                        className="
                    w-full
                    border-2
                    border-dashed
                    border-slate-300
                    rounded-2xl
                    p-12
                    text-slate-500
                    hover:border-teal-500
                    hover:text-teal-600
                    transition
                  "
                      >
                        Seleccionar fotografía
                      </button>
                    ) : (
                      <img
                        src={URL.createObjectURL(preview)}
                        alt="Preview"
                        className="w-full h-72 object-cover rounded-2xl border"
                      />
                    )}

                    <Field label="Descripción">
                      <Input
                        value={descripcion}
                        onChange={(e) =>
                          setDescripcion(e.target.value)
                        }
                        placeholder="Describe la fotografía"
                      />
                    </Field>

                  </div>
                </div>

                {/* FOOTER */}
                <div className={ui.modal.formActions}>
                  <Boton
                    variant="secondary"
                    onClick={limpiar}
                  >
                    Cancelar
                  </Boton>

                  <Boton
                    onClick={() => setShowConfirm(true)}
                    disabled={!preview}
                  >
                    Guardar Fotografía
                  </Boton>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={subirFotos}
      />
      <ModalConfirmacion
        open={showConfirm}
        title="Guardar fotografía"
        description="¿Deseas guardar esta fotografía en el expediente?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={confirmarSubida}
        onClose={() => setShowConfirm(false)}
        color="teal"
      />
      <ModalConfirmacion
        open={showDeleteConfirm}
        title="Eliminar fotografía"
        description="¿Deseas eliminar esta fotografía?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="red"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={eliminarFotografiaActual}
      />

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