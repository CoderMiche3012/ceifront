import { HandCoins } from "lucide-react";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { useState, useMemo, } from "react";
import { obtenerSeguimiento } from "../../../../services/seguimientoService";
import { crearApoyo, actualizarApoyo, eliminarApoyo, } from "../../../../services/apoyosService";
import ApoyoTabla from "./tabla/ApoyoTabla";
import ApoyoFiltros from "./tabla/ApoyoFiltros";
import PaginacionTabla from "../../../../../../components/tablas/PaginacionTabla";
import Boton from "../../../../../../components/ui/BotonInterno";
import Alerta from "../../../../../../components/ui/AlertaError";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";

export default function DetalleSeguimientoEconomico({
  idSeguimiento,
}) {
  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [alerta, setAlerta] =
    useState({
      open: false,
      mensaje: "",
      tipo: "error",
    });

  const [modalCrear, setModalCrear] = useState(false);

  const [
    modalConfirmacion,
    setModalConfirmacion,
  ] = useState(false);

  const [
    modalResultado,
    setModalResultado,
  ] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] =
    useState({
      concepto: "",
      monto: "",
    });

  const [
    modoEdicion,
    setModoEdicion,
  ] = useState(false);

  const [
    apoyoSeleccionado,
    setApoyoSeleccionado,
  ] = useState(null);

  const [
    accionPendiente,
    setAccionPendiente,
  ] = useState(null);

  const PAGE_SIZE = 4;

  const { data, isLoading } =
    useQuery({
      queryKey: [
        "seguimiento",
        idSeguimiento,
      ],

      queryFn: () =>
        obtenerSeguimiento(
          idSeguimiento
        ),

      enabled: !!idSeguimiento,
    });

  const crearApoyoMutation =
    useMutation({
      mutationFn: crearApoyo,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["seguimiento", idSeguimiento],
        });

        queryClient.invalidateQueries({
          queryKey: ["seguimientos", data?.id_beneficiario],
        });


        setModalConfirmacion(
          false
        );

        setModalResultado({
          open: true,
          type: "success",
          title:
            "Apoyo registrado",
          message:
            "El apoyo económico fue agregado correctamente.",
        });

        setFormData({
          concepto: "",
          monto: "",
        });

        setAlerta({
          open: false,
          mensaje: "",
          tipo: "error",
        });
      },

      onError: (error) => {
        setModalConfirmacion(
          false
        );

        setModalResultado({
          open: true,
          type: "error",
          title:
            "Error al registrar",
          message:
            error?.response?.data
              ?.message ||
            "No se pudo registrar el apoyo económico.",
        });
      },
    });

  const actualizarApoyoMutation =
    useMutation({
      mutationFn: ({
        id,
        data,
      }) =>
        actualizarApoyo(
          id,
          data
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["seguimiento", idSeguimiento],
        });

        queryClient.invalidateQueries({
          queryKey: ["seguimientos", data?.id_beneficiario],
        });

        setModalConfirmacion(
          false
        );

        setModalResultado({
          open: true,
          type: "success",
          title:
            "Apoyo actualizado",
          message:
            "El apoyo económico fue actualizado correctamente.",
        });

        setModoEdicion(false);

        setFormData({
          concepto: "",
          monto: "",
        });

        setAlerta({
          open: false,
          mensaje: "",
          tipo: "error",
        });
      },

      onError: () => {
        setModalResultado({
          open: true,
          type: "error",
          title:
            "Error al actualizar",
          message:
            "No se pudo actualizar el apoyo.",
        });
      },
    });

  const eliminarApoyoMutation =
    useMutation({
      mutationFn:
        eliminarApoyo,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["seguimiento", idSeguimiento],
        });

        queryClient.invalidateQueries({
          queryKey: ["seguimientos", data?.id_beneficiario],
        });

        setModalConfirmacion(
          false
        );

        setModalResultado({
          open: true,
          type: "success",
          title:
            "Apoyo eliminado",
          message:
            "El apoyo económico fue eliminado correctamente.",
        });
      },

      onError: () => {
        setModalResultado({
          open: true,
          type: "error",
          title:
            "Error al eliminar",
          message:
            "No se pudo eliminar el apoyo.",
        });
      },
    });

  const entregarApoyoMutation =
    useMutation({
      mutationFn: ({
        id,
        data,
      }) =>
        actualizarApoyo(
          id,
          data
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["seguimiento", idSeguimiento],
        });

        queryClient.invalidateQueries({
          queryKey: ["seguimientos", data?.id_beneficiario],
        });

        setModalConfirmacion(
          false
        );

        setModalResultado({
          open: true,
          type: "success",
          title:
            "Apoyo entregado",
          message:
            "El apoyo fue marcado como entregado.",
        });
      },

      onError: () => {
        setModalResultado({
          open: true,
          type: "error",
          title: "Error",
          message:
            "No se pudo actualizar el apoyo.",
        });
      },
    });

  const apoyos =
    data?.apoyos_economicos ||
    [];

  const apoyosFiltrados =
    useMemo(() => {
      return apoyos
        .filter((apoyo) =>
          apoyo.concepto
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )

        .sort((a, b) => {
          if (
            a.estatus ===
            "Pendiente" &&
            b.estatus !==
            "Pendiente"
          ) {
            return -1;
          }

          if (
            a.estatus !==
            "Pendiente" &&
            b.estatus ===
            "Pendiente"
          ) {
            return 1;
          }

          return 0;
        });
    }, [apoyos, search]);

  // PAGINACION
  const totalPages =
    Math.ceil(
      apoyosFiltrados.length /
      PAGE_SIZE
    );

  const apoyosPaginados =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        PAGE_SIZE;

      const end =
        start + PAGE_SIZE;

      return apoyosFiltrados.slice(
        start,
        end
      );
    }, [
      apoyosFiltrados,
      currentPage,
    ]);

  const handleSearchChange = (
    value
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // VALIDAR
  const handleGuardarApoyo =
    () => {
      if (
        !formData.concepto ||
        !formData.monto
      ) {
        setAlerta({
          open: true,
          mensaje:
            "Completa todos los campos.",
          tipo: "error",
        });

        return;
      }

      setAlerta({
        open: false,
        mensaje: "",
        tipo: "error",
      });

      setModalCrear(false);

      setAccionPendiente(
        modoEdicion
          ? "editar"
          : "crear"
      );

      setModalConfirmacion(
        true
      );
    };

  // CONFIRMAR ACCIONES
  const confirmarAccion =
    () => {
      const fechaHoy =
        new Date()
          .toISOString()
          .split("T")[0];

      // CREAR
      if (
        accionPendiente ===
        "crear"
      ) {
        crearApoyoMutation.mutate(
          {
            id_seguimiento:
              idSeguimiento,

            concepto:
              formData.concepto,

            monto: Number(
              formData.monto
            ),

            fecha_creacion:
              fechaHoy,

            fecha_entrega:
              fechaHoy,

            estatus:
              "Pendiente",
          }
        );
      }

      // EDITAR
      if (
        accionPendiente ===
        "editar"
      ) {
        actualizarApoyoMutation.mutate(
          {
            id: apoyoSeleccionado.id_apoyo,

            data: {
              concepto:
                formData.concepto,

              monto: Number(
                formData.monto
              ),
            },
          }
        );
      }

      // ELIMINAR
      if (
        accionPendiente ===
        "eliminar"
      ) {
        eliminarApoyoMutation.mutate(
          apoyoSeleccionado.id_apoyo
        );
      }

      // ENTREGAR
      if (
        accionPendiente ===
        "entregar"
      ) {
        entregarApoyoMutation.mutate(
          {
            id: apoyoSeleccionado.id_apoyo,

            data: {
              estatus:
                "Entregado",

              fecha_entrega:
                fechaHoy,
            },
          }
        );
      }
    };

  // LOADING
  if (isLoading) {
    return (
      <p className="text-sm text-slate-500">
        Cargando apoyos...
      </p>
    );
  }

  return (
    <>
      <div className="mt-4 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <HandCoins className="w-4 h-4 text-teal-600" />
                Apoyos Económicos
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Historial de apoyos
                entregados
              </p>
            </div>

            <Boton
              onClick={() => {
                setModoEdicion(
                  false
                );

                setFormData({
                  concepto: "",
                  monto: "",
                });

                setAlerta({
                  open: false,
                  mensaje: "",
                  tipo: "error",
                });

                setModalCrear(
                  true
                );
              }}
            >
              Agregar apoyo
            </Boton>
          </div>

          <ApoyoFiltros
            search={search}
            filters={{}}
            onSearchChange={
              handleSearchChange
            }
            onFilterChange={() => { }}
            onClearFilters={() => {
              setSearch("");
              setCurrentPage(1);
            }}
          />
        </div>

        <ApoyoTabla
          donativos={apoyosPaginados.map(
            (apoyo) => ({
              ...apoyo,

              fecha:
                apoyo.fecha_entrega,
            })
          )}

          onEditar={(item) => {
            setModoEdicion(
              true
            );

            setApoyoSeleccionado(
              item
            );

            setFormData({
              concepto:
                item.concepto ||
                "",

              monto:
                item.monto ||
                "",
            });

            setAlerta({
              open: false,
              mensaje: "",
              tipo: "error",
            });

            setModalCrear(
              true
            );
          }}

          onEliminar={(item) => {
            setApoyoSeleccionado(
              item
            );

            setAccionPendiente(
              "eliminar"
            );

            setModalConfirmacion(
              true
            );
          }}

          onEntregar={(item) => {
            setApoyoSeleccionado(
              item
            );

            setAccionPendiente(
              "entregar"
            );

            setModalConfirmacion(
              true
            );
          }}
        />

        <PaginacionTabla
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          totalItems={
            apoyosFiltrados.length
          }
          pageSize={PAGE_SIZE}
          onPageChange={
            setCurrentPage
          }
        />
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modalCrear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                {modoEdicion
                  ? "Editar apoyo económico"
                  : "Agregar apoyo económico"}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {modoEdicion
                  ? "Modifica la información del apoyo."
                  : "Completa la información del apoyo."}
              </p>
            </div>

            <div className="space-y-4">
              {/* CONCEPTO */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Concepto
                </label>

                <input
                  type="text"
                  value={
                    formData.concepto
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      concepto:
                        e.target
                          .value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder="Ej. Uniforme escolar"
                />
              </div>

              {/* MONTO */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Monto
                </label>

                <input
                  type="number"
                  value={
                    formData.monto
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto:
                        e.target
                          .value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-4">
              <Alerta
                open={alerta.open}
                mensaje={
                  alerta.mensaje
                }
                tipo={alerta.tipo}
                onClose={() =>
                  setAlerta({
                    ...alerta,
                    open: false,
                  })
                }
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setAlerta({
                    open: false,
                    mensaje: "",
                    tipo: "error",
                  });

                  setModalCrear(
                    false
                  );
                }}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  handleGuardarApoyo
                }
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                {modoEdicion
                  ? "Guardar cambios"
                  : "Continuar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION */}
      <ModalConfirmacion
        open={
          modalConfirmacion
        }
        title={
          accionPendiente ===
            "editar"
            ? "Editar apoyo"
            : accionPendiente ===
              "eliminar"
              ? "Eliminar apoyo"
              : accionPendiente ===
                "entregar"
                ? "Confirmar entrega"
                : "Agregar apoyo económico"
        }
        description={
          accionPendiente ===
            "editar"
            ? "¿Deseas guardar los cambios del apoyo?"
            : accionPendiente ===
              "eliminar"
              ? "¿Deseas eliminar este apoyo económico?"
              : accionPendiente ===
                "entregar"
                ? "¿Deseas marcar este apoyo como entregado?"
                : "¿Deseas registrar este apoyo económico?"
        }
        confirmText={
          accionPendiente ===
            "editar"
            ? "Guardar"
            : accionPendiente ===
              "eliminar"
              ? "Eliminar"
              : accionPendiente ===
                "entregar"
                ? "Confirmar"
                : "Agregar"
        }
        cancelText="Cancelar"
        onClose={() =>
          setModalConfirmacion(
            false
          )
        }
        onConfirm={
          confirmarAccion
        }
        loading={
          crearApoyoMutation.isPending ||
          actualizarApoyoMutation.isPending ||
          eliminarApoyoMutation.isPending ||
          entregarApoyoMutation.isPending
        }
        color={
          accionPendiente ===
            "eliminar"
            ? "red"
            : accionPendiente ===
              "entregar"
              ? "green"
              : "teal"
        }
      />

      {/* MODAL RESULTADO */}
      <ModalResultado
        open={
          modalResultado.open
        }
        type={
          modalResultado.type
        }
        title={
          modalResultado.title
        }
        message={
          modalResultado.message
        }
        onClose={() =>
          setModalResultado({
            ...modalResultado,
            open: false,
          })
        }
      />
    </>
  );
}

