import { useEffect, useState } from "react";
import { HiOutlineDocumentText, HiOutlineX, } from "react-icons/hi";

import { ui } from "../../../../../../styles/ui/index";

import Field from "../../../../../../components/ui/Field";
import Boton from "../../../../../../components/ui/Boton";

import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";

import { useActualizarDatosEscolares } from "../../../../hooks/seguimiento/useDatosEscolaresK";

export default function EditarNotaGeneral({ isOpen, onClose, data }) {
  // estado
  const [showConfirm, setShowConfirm] = useState(false);
  const [nota, setNota] = useState("");
  const [resultado, setResultado] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  // mutacion
  const actualizarMutation = useActualizarDatosEscolares();

  // precargar nota
  useEffect(() => {
    if (isOpen) {
      setNota(data?.nota_escolar || "");
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleGuardar = async () => {
    try {

      await actualizarMutation.mutateAsync({ id: data.id_datos_escolares, data: { nota_escolar:nota }, });
      setShowConfirm(false);
      setResultado({
        open: true,
        type: "success",
        title: "Nota actualizada",
        message: "La nota se guardó correctamente.",
      });
    } catch (error) {
      console.log(error)
      setShowConfirm(false);
      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: error.message || "Ocurrió un problema al guardar la nota.",
      });
    }
  };

  const handleCloseResultado = () => {
    setResultado((prev) => ({
      ...prev,
      open: false,
    }));

    if (resultado.type === "success") {
      onClose();
    }
  };

  return (
    <>
      <div className={ui.modal.formOverlay}>
        <div className="w-full max-w-2xl">
          <div className={ui.modal.formContainer}>

            <div className={ui.modal.formHeader}>
              <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63] `} >
                <HiOutlineDocumentText size={24} />
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>
                  Editar Nota
                </h2>

                <p className={ui.modal.description}>
                  Agrega observaciones o comentarios del donador
                </p>
              </div>

              <button
                onClick={onClose}
                className=" p-2 rounded-xl hover:bg-slate-100 transition "
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <div className={ui.modal.formBody}>
              <div className={ui.modal.formScroll}>
                <Field label="Nota">
                  <textarea
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    rows={8}
                    placeholder="Escribe una nota..."
                    className="
                      w-full rounded-2xl border border-slate-300 bg-white px-4 py-3
                      text-sm text-slate-700 resize-none outline-none transition focus:ring-2 focus:ring-[#0E5F63]
                    "
                  />
                </Field>
              </div>

              {/* acciones */}
              <div className={ui.modal.formActions}>
                <Boton
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Boton>

                <Boton
                  onClick={() =>  setShowConfirm(true) }
                  disabled={ actualizarMutation.isPending }
                >
                  {actualizarMutation.isPending ? "Guardando..." : "Guardar Nota"}
                </Boton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="Guardar cambios"
        description="¿Deseas actualizar la nota?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleGuardar}
        onClose={() => setShowConfirm(false) }
        loading={ actualizarMutation.isPending  }
        color="teal"
      />

      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={handleCloseResultado}
      />
    </>
  );
}