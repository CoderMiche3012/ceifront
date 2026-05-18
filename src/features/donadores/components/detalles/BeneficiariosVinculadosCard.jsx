import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Search, X, UserPlus, Loader2, CheckCircle2, Trash2, } from "lucide-react";
import AvatarGeneral from "../../../../components/shared/AvatarGeneral";
import { useBeneficiariosVinculados } from "../../hooks/useBeneficiariosVinculados";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

export default function BeneficiariosVinculadosCard({ data, setData, }) {
  const navigate = useNavigate();
  const [modalEliminar, setModalEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const donadorActivo =
    data?.estatus?.toLowerCase() === "activo";
  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

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
    cargarBeneficiarios,
  } = useBeneficiariosVinculados(data, setData);

  useEffect(() => {
    if (openModal) {
      cargarBeneficiarios();
    }
  }, [openModal]);

  const irExpediente = (id) => {
    navigate(`/App/beneficiarios/expediente/${id}`);
  };

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
    } catch (error) {
      setResultado({
        open: true,
        type: "error",
        title: "Error al eliminar",
        message: "No se pudo eliminar el beneficiario.",
      });
    }
  };

  return (
    <>
      {/* PRINCIPAL */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Users className="w-5 h-5 text-teal-600" />
            Beneficiarios Vinculados
          </h3>

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
            className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA */}
        <div className="space-y-3">
          {data?.beneficiarios?.length > 0 ? (
            data.beneficiarios.map((item) => (
              <div
                key={item.id_beneficiario}
                onClick={() => irExpediente(item.id_beneficiario)}
                role="button"
                tabIndex={0}
                className="w-full p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 flex items-center gap-4 group transition cursor-pointer"
              >
                <AvatarGeneral
                  nombre={item.nombre}
                  apellidoP={item.apellido_p}
                  className="h-12 w-12 text-sm"
                />

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {item.nombre} {item.apellido_p}
                  </p>

                  <p className="text-sm text-slate-500">
                    {calcularEdad(item.fecha_nacimiento)} años •{" "}
                    {item.genero || "--"}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdEliminar(item.id_beneficiario);
                    setModalEliminar(true);
                  }}
                  className="h-10 w-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                  title="Eliminar beneficiario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50">
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

      {/* MODAL PARA AGREGAR */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Agregar beneficiario
                </h3>

                <p className="text-sm text-slate-500">
                  Solo activos disponibles
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* BUSCADOR */}
            <div className="p-6 border-b border-slate-100">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar beneficiario..."
                  className="w-full h-11 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* LISTA MODAL */}
            <div className="max-h-[430px] overflow-y-auto p-6 space-y-3">
              {loading ? (
                <div className="py-10 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
                </div>
              ) : filtrados.length > 0 ? (
                filtrados.map((item) => (
                  <div
                    key={item.id_beneficiario}
                    className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <AvatarGeneral
                        nombre={item.nombre}
                        apellidoP={item.apellido_p}
                        className="h-12 w-12 text-sm"
                      />

                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.nombre} {item.apellido_p}
                        </p>

                        <p className="text-sm text-slate-500">
                          {calcularEdad(item.fecha_nacimiento)} años •{" "}
                          {item.genero || "--"}
                        </p>
                      </div>
                    </div>

                    <button
                      disabled={loadingId === item.id_beneficiario}
                      onClick={() =>
                        handleAgregar(item.id_beneficiario)
                      }
                      className="px-4 h-10 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
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
      )}

      <ModalConfirmacion
        open={modalEliminar}
        title="Eliminar beneficiario"
        description="¿Seguro que deseas eliminar este beneficiario? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        color="red"
        onClose={() => setModalEliminar(false)}
        onConfirm={confirmarEliminar}
      />

      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() =>
          setResultado((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
}