import { Users, Plus, Search, X, UserPlus, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AvatarGeneral from "../../../../components/shared/AvatarGeneral";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import Card from "../../../../components/ui/Card";

import { ui } from "../../../../styles/ui/uiClasses";

import { useBeneficiariosVinculados } from "../../hooks/useBeneficiariosVinculados";

export default function BeneficiariosVinculadosCard({ data, canEdit }) {

  const navigate = useNavigate();

  const [modalEliminar, setModalEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [idAgregar, setIdAgregar] = useState(null);

  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const donadorActivo = data?.estatus?.toLowerCase() === "activo";

  const {
    openModal,
    setOpenModal,
    search,
    setSearch,
    loading,
    loadingId,
    filtrados,
    handleAgregar,
    handleEliminar,
    calcularEdad,
  } = useBeneficiariosVinculados(data);
  // navegar a expediente del beneficiario
  const irExpediente = (id) => {
    navigate(`/App/beneficiarios/expediente/${id}`);
  };
  // confirmar eliminación
  const confirmarEliminar = async () => {
    try {
      await handleEliminar(idEliminar);
      setModalEliminar(false);
      setResultado({
        open: true,
        type: "success",
        title: "Beneficiario eliminado",
        message: "El beneficiario fue desvinculado correctamente.",
      });
    } catch {
      setResultado({
        open: true,
        type: "error",
        title: "Error al eliminar",
        message: "No se pudo eliminar el beneficiario.",
      });
    }
  };
  const confirmarAgregar = async () => {
    try {
      await handleAgregar(idAgregar);
      setModalAgregar(false);
      setOpenModal(false);
      setResultado({
        open: true,
        type: "success",
        title: "Beneficiario agregado",
        message: "El beneficiario fue vinculado correctamente.",
      });
    } catch {
      setResultado({
        open: true,
        type: "error",
        title: "Error al agregar",
        message: "No se pudo vincular el beneficiario.",
      });
    }
  };
  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
              <Users className={`w-5 h-5 ${ui.primaryIcon}`} />
              Beneficiarios vinculados
            </h3>

            <p className={ui.header.description}>
              Beneficiarios asignados al donador
            </p>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                if (!donadorActivo) {
                  setResultado({
                    open: true,
                    type: "warning",
                    title: "Donador inactivo",
                    message:
                      "Solo se pueden asignar beneficiarios a donadores activos.",
                  });
                  return;
                }
                setOpenModal(true);
              }}
              className={`${ui.button.base} ${ui.button.sm} ${ui.button.primary} w-10 px-0`}
            >
              <Plus className="w-7 h-7" />
            </button>
          )}
        </div>
        {/* lista */}
        <div className="space-y-3">
          <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scroll">
            {data?.beneficiarios_apoyados?.length > 0 ? (
              data.beneficiarios_apoyados.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => irExpediente(item.id)}
                  className="
                  group flex items-center gap-4
                  rounded-2xl border border-slate-100
                  p-4 transition-all hover:bg-slate-50
                  cursor-pointer
                "
                >
                  <AvatarGeneral
                    nombre={item.nombre}
                    className="h-12 w-12 text-sm"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {item.nombre} {item.apellido_p}
                    </p>

                    <p className="text-sm text-slate-500">
                      {calcularEdad(item.fecha_nacimiento)} años
                    </p>
                  </div>
                  {canEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdEliminar(item.id);
                        setModalEliminar(true);
                      }}
                      className={`
                  ${ui.button.base}
                    h-10 w-10 rounded-xl
                    bg-red-50 text-red-500
                    hover:bg-red-100 hover:text-red-700
                    opacity-0 group-hover:opacity-100
                   `}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className=" rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center ">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-600">
                  Aún no tiene beneficiarios asignados
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Presiona + para agregar uno.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* MODAL SELECCIÓN */}
      {openModal && (
        <div className={ui.modal.formOverlay}>
          <div className="absolute inset-0" onClick={() => setOpenModal(false)} />

          <div className={`${ui.modal.formContainer} relative max-w-2xl`}>
            {/* HEADER */}
            <div className={ui.modal.formHeader}>
              <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
                <Users size={24} />
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>
                  Vincular beneficiario
                </h2>
                <p className={ui.modal.description}>
                  Solo beneficiarios activos disponibles
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className={ui.modal.formBody}>
              {/* buscar */}
              <div className="mb-5">
                <div className="relative">
                  <Search className={ui.filters.searchIcon} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar beneficiario..."
                    className={ui.filters.input}
                  />
                </div>
              </div>
              {/* lista */}
              <div className={`${ui.modal.formScroll} space-y-3`}>
                {loading ? (
                  <div className="py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
                  </div>
                ) : filtrados.length > 0 ? (
                  filtrados.map((item) => (
                    <div
                      key={item.id_beneficiario}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <AvatarGeneral
                          nombre={item.expediente_resumen?.nombre_completo}
                          apellidoP=""
                          className="h-12 w-12 text-sm"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.expediente_resumen?.nombre_completo}
                          </p>
                          <p className="text-sm text-slate-500">
                            {calcularEdad(item.expediente_resumen?.fecha_nacimiento)}{" "}
                            años
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={loadingId === item.id_beneficiario}
                        onClick={() => {
                          setIdAgregar(item.id_beneficiario);
                          setModalAgregar(true);
                        }} className={`${ui.button.base} ${ui.button.sm} ${ui.button.primary}`}
                      >
                        {loadingId === item.id_beneficiario ? (
                          "Agregando..."
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Agregar
                          </>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="font-semibold text-slate-600">
                      No hay beneficiarios disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      <ModalConfirmacion
        open={modalEliminar}
        title="Eliminar beneficiario"
        description="¿Seguro que deseas eliminar este beneficiario?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        color="red"
        onClose={() => setModalEliminar(false)}
        onConfirm={confirmarEliminar}
      />
      <ModalConfirmacion
        open={modalAgregar}
        title="Agregar beneficiario"
        description="¿Deseas vincular este beneficiario al donador?"
        confirmText="Sí, agregar"
        cancelText="Cancelar"
        color="green"
        onClose={() => setModalAgregar(false)}
        onConfirm={confirmarAgregar}
      />

      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() =>
          setResultado((prev) => ({ ...prev, open: false }))
        }
      />
    </>
  );
}