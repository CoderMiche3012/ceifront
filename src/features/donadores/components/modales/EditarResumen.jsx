import { useEffect, useState } from "react";
import { HiOutlineCalendar, HiOutlineUser, HiOutlineX, } from "react-icons/hi";
import { ui } from "../../../../styles/ui/index";

import Field from "../../../../components/ui/Field";
import Input from "../../../../components/ui/InputG";
import Select from "../../../../components/ui/Select";
import Boton from "../../../../components/ui/Boton";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { useActualizarDonador } from "../../hooks/useDonadores";
import { obtenerUsuario } from "../../../../storage/userStorage";

export default function EditarResumen({ isOpen, onClose, data }) {
  // estados locales
const usuarioActual = obtenerUsuario();
  const puedeEditarFechaIngreso = usuarioActual?.esAdmin === true || usuarioActual?.esSuperUser === true;
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultado, setResultado] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  const [form, setForm] = useState({
    fecha_ingreso: "",
    estatus: "",
  });

  const actualizarMutation = useActualizarDonador();

  // precargar datos
  useEffect(() => {
    if (isOpen && data) {
      setForm({
        fecha_ingreso: data.fecha_ingreso || "",
        estatus: data.estatus || "",
      });
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const updateField = ( field, value ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGuardar = async () => {
    try {
      await actualizarMutation.mutateAsync({ id: data.id_donador, data: { fecha_ingreso: form.fecha_ingreso,  estatus: form.estatus, }, });
      setShowConfirm(false);
      setResultado({
        open: true,
        type: "success",
        title: "Datos actualizados",
        message: "La información se guardó correctamente.",
      });
    } catch (error) {
      setShowConfirm(false);
      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: error.message || "Ocurrió un problema al guardar.",
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
              <div className={` ${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63] `} >
                <HiOutlineUser size={24} />
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>
                  Editar Resumen
                </h2>

                <p className={ui.modal.description}>
                  Actualiza información general del donador
                </p>
              </div>

              <button
                onClick={onClose}
                className=" p-2 rounded-xl hover:bg-slate-100  transition "
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <div className={ui.modal.formBody}>
              <div className={ui.modal.formScroll}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Field label="Fecha de ingreso" required >
                    <Input
                      type="date"
                      disabled={!puedeEditarFechaIngreso}
                      value={ form.fecha_ingreso }
                      onChange={(e) => updateField("fecha_ingreso", e.target.value ) }
                    />
                  </Field>

                  <Field label="Estatus" required >
                    <Select
                      value={form.estatus}
                      onChange={(e) => updateField( "estatus", e.target.value ) }
                    >
                      <option value="">
                        Selecciona un estatus
                      </option>

                      <option value="Activo">
                        Activo
                      </option>

                      <option value="Inactivo">
                        Inactivo
                      </option>
                    </Select>
                  </Field>
                </div>
              </div>

              <div className={ui.modal.formActions}>
                <Boton
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Boton>

                <Boton
                  onClick={() => setShowConfirm(true) }
                  disabled={ actualizarMutation.isPending }
                >
                  {actualizarMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                </Boton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="Guardar cambios"
        description="¿Deseas actualizar la información?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleGuardar}
        onClose={() => setShowConfirm(false) }
        loading={ actualizarMutation.isPending }
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