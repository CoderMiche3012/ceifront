// por corregir si se cambia backend

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Plus,
  Search,
  X,
  UserPlus,
  Loader2,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import AvatarGeneral from "../../../../components/shared/AvatarGeneral";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import Card from "../../../../components/ui/Card";

import { ui } from "../../../../styles/ui/uiClasses";

import { useBeneficiariosVinculados } from "../../hooks/useBeneficiariosVinculados";

export default function BeneficiariosVinculadosCard({
  data,
  setData,
}) {
  const navigate = useNavigate();

  const [modalEliminar, setModalEliminar] =
    useState(false);

  const [idEliminar, setIdEliminar] =
    useState(null);

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
  } = useBeneficiariosVinculados(
    data,
    setData
  );

  useEffect(() => {
    if (openModal) {
      cargarBeneficiarios();
    }
  }, [openModal]);

  const irExpediente = (id) => {
    navigate(
      `/App/beneficiarios/expediente/${id}`
    );
  };

  const confirmarEliminar = async () => {
    try {
      await handleEliminar(idEliminar);

      setModalEliminar(false);

      setResultado({
        open: true,
        type: "success",
        title: "Beneficiario eliminado",
        message:
          "El beneficiario fue desvinculado correctamente.",
      });
    } catch {
      setResultado({
        open: true,
        type: "error",
        title: "Error al eliminar",
        message:
          "No se pudo eliminar el beneficiario.",
      });
    }
  };

  return (
    <>
      {/* CARD */}
      <Card>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
              <Users
                className={`w-5 h-5 ${ui.primaryIcon}`}
              />

              Beneficiarios vinculados
            </h3>

            <p className={ui.header.description}>
              Beneficiarios asignados al donador
            </p>
          </div>

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
            className={`
              ${ui.button.base}
              ${ui.button.sm}
              ${ui.button.primary}
              w-10 px-0
            `}
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* LISTA */}
        <div className="space-y-3">
          {data?.beneficiarios?.length > 0 ? (
            data.beneficiarios.map((item) => (
              <div
                key={item.id_beneficiario}
                role="button"
                tabIndex={0}
                onClick={() =>
                  irExpediente(
                    item.id_beneficiario
                  )
                }
                className="
                  group
                  flex items-center gap-4
                  rounded-2xl
                  border border-slate-100
                  p-4
                  transition-all
                  hover:bg-slate-50
                  cursor-pointer
                "
              >
                <AvatarGeneral
                  nombre={item.nombre}
                  apellidoP={item.apellido_p}
                  className="h-12 w-12 text-sm"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {item.nombre}{" "}
                    {item.apellido_p}
                  </p>

                  <p className="text-sm text-slate-500">
                    {calcularEdad(
                      item.fecha_nacimiento
                    )}{" "}
                    años •{" "}
                    {item.genero || "--"}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setIdEliminar(
                      item.id_beneficiario
                    );

                    setModalEliminar(true);
                  }}
                  className={`
                    ${ui.button.base}
                    h-10 w-10
                    rounded-xl
                    bg-red-50
                    text-red-500
                    hover:bg-red-100
                    hover:text-red-700
                    opacity-0
                    group-hover:opacity-100
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div
              className="
                rounded-2xl
                border-2 border-dashed border-slate-200
                bg-slate-50
                p-10
                text-center
              "
            >
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
      </Card>

      {/* MODAL */}
      {openModal && (
        <div className={ui.modal.formOverlay}>
          <div
            className="absolute inset-0"
            onClick={() =>
              setOpenModal(false)
            }
          />

          <div
            className={`${ui.modal.formContainer} relative max-w-2xl`}
          >
            {/* HEADER */}
            <div className={ui.modal.formHeader}>
              <div
                className={`
                  ${ui.modal.iconWrapper}
                  bg-[#0E5F63]/10
                  text-[#0E5F63]
                `}
              >
                <Users size={24} />
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>
                  Vincular beneficiario
                </h2>

                <p
                  className={
                    ui.modal.description
                  }
                >
                  Solo beneficiarios activos
                  disponibles
                </p>
              </div>

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="
                  h-10 w-10
                  rounded-xl
                  hover:bg-slate-100
                  flex items-center justify-center
                "
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* BODY */}
            <div className={ui.modal.formBody}>
              {/* BUSCADOR */}
              <div className="mb-5">
                <div className="relative">
                  <Search
                    className={ui.filters.searchIcon}
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Buscar beneficiario..."
                    className={ui.filters.input}
                  />
                </div>
              </div>

              {/* LISTA */}
              <div
                className={`${ui.modal.formScroll} space-y-3`}
              >
                {loading ? (
                  <div className="py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
                  </div>
                ) : filtrados.length > 0 ? (
                  filtrados.map((item) => (
                    <div
                      key={
                        item.id_beneficiario
                      }
                      className="
                        flex items-center justify-between
                        rounded-2xl
                        border border-slate-100
                        p-4
                      "
                    >
                      <div className="flex items-center gap-4">
                        <AvatarGeneral
                          nombre={item.nombre}
                          apellidoP={
                            item.apellido_p
                          }
                          className="h-12 w-12 text-sm"
                        />

                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.nombre}{" "}
                            {
                              item.apellido_p
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {calcularEdad(
                              item.fecha_nacimiento
                            )}{" "}
                            años •{" "}
                            {item.genero ||
                              "--"}
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={
                          loadingId ===
                          item.id_beneficiario
                        }
                        onClick={() =>
                          handleAgregar(
                            item.id_beneficiario
                          )
                        }
                        className={`
                          ${ui.button.base}
                          ${ui.button.sm}
                          ${ui.button.primary}
                        `}
                      >
                        {loadingId ===
                        item.id_beneficiario ? (
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
                      No hay beneficiarios
                      disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalConfirmacion
        open={modalEliminar}
        title="Eliminar beneficiario"
        description="¿Seguro que deseas eliminar este beneficiario?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        color="red"
        onClose={() =>
          setModalEliminar(false)
        }
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