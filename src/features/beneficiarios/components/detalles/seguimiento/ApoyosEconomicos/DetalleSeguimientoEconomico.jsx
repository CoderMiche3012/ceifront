import { useState, useMemo } from "react";

import Field from "../../../../../../components/ui/Field";
import Input from "../../../../../../components/ui/InputG";
import { ui } from "../../../../../../styles/ui/index";
import { HandCoins } from "lucide-react";
import { HiOutlineX } from "react-icons/hi";
import BotonPrincipal from "../../../../../../components/ui/Boton";

// 1. Importación de tus hooks personalizados
import {
  useCrearApoyo,
  useActualizarApoyo,
  useEliminarApoyo
} from "./../../../../hooks/useApoyos"; // Ajusta esta ruta a donde guardes los hooks

import ApoyoTabla from "./tabla/ApoyoTabla";
import ApoyoFiltros from "./tabla/ApoyoFiltros";
import PaginacionTabla from "../../../../../../components/tablas/PaginacionTabla";
import Boton from "../../../../../../components/ui/BotonInterno";
import Alerta from "../../../../../../components/ui/AlertaError";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";
import { useSubirDocumento, useActualizarDocumento } from "../../../../../expedientes/hooks/useDocumentos";

export default function DetalleSeguimientoEconomico({ seguimiento, dataT }) {
  const actualizarDocumentoMutation = useActualizarDocumento();
  const idSeguimiento = seguimiento?.id_seguimiento;
  const data = seguimiento;
  const documentos = dataT?.documentos

  // 2. Uso de tus hooks personalizados de TanStack Query
  const crearApoyoMutation = useCrearApoyo();
  const actualizarApoyoMutation = useActualizarApoyo();
  const eliminarApoyoMutation = useEliminarApoyo();
  // Se usa la misma mutación de actualización para la acción de "entregar"
  const entregarApoyoMutation = useActualizarApoyo();
  const subirDocumentoMutation = useSubirDocumento();


  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [alerta, setAlerta] = useState({ open: false, mensaje: "", tipo: "error" });
  const [modalCrear, setModalCrear] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [modalResultado, setModalResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({ concepto: "", monto: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [apoyoSeleccionado, setApoyoSeleccionado] = useState(null);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [archivoComprobante, setArchivoComprobante] = useState(null);

  const PAGE_SIZE = 4;
  const apoyos = data?.apoyos_economicos || [];

  // FILTROS Y ORDENAMIENTO
  const apoyosFiltrados = useMemo(() => {
    return apoyos
      .filter((apoyo) =>
        apoyo.concepto?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.estatus === "Pendiente" && b.estatus !== "Pendiente") return -1;
        if (a.estatus !== "Pendiente" && b.estatus === "Pendiente") return 1;
        return 0;
      });
  }, [apoyos, search]);

  // PAGINACIÓN
  const totalPages = Math.ceil(apoyosFiltrados.length / PAGE_SIZE);

  const apoyosPaginados = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return apoyosFiltrados.slice(start, end);
  }, [apoyosFiltrados, currentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // VALIDAR COMPONENTES ANTES DE CONFIRMAR
  const handleGuardarApoyo = () => {
    if (!formData.concepto || !formData.monto) {
      setAlerta({
        open: true,
        mensaje: "Completa todos los campos.",
        tipo: "error",
      });
      return;
    }

    setAlerta({ open: false, mensaje: "", tipo: "error" });
    setModalCrear(false);
    setAccionPendiente(modoEdicion ? "editar" : "crear");
    setModalConfirmacion(true);
  };

  // MANEJADORES DE RESPUESTAS (Handlers estándar reemplazando la repetición del onSuccess/onError)
  const resetFormYAlerta = () => {
    setModalConfirmacion(false);
    setFormData({ concepto: "", monto: "" });
    setAlerta({ open: false, mensaje: "", tipo: "error" });
    setModoEdicion(false);
  };

  const lanzarModalResultado = (type, title, message) => {
    setModalResultado({ open: true, type, title, message });
  };

  // CONFIRMAR ACCIONES EJECUTANDO LOS `.mutate` DE TUS HOOKS
  const confirmarAccion = () => {
    const fechaHoy = new Date().toISOString().split("T")[0];

    // CREAR
    if (accionPendiente === "crear") {
      crearApoyoMutation.mutate(
        {
          id_seguimiento: idSeguimiento,
          concepto: formData.concepto,
          monto: Number(formData.monto),
          fecha_creacion: fechaHoy,
          fecha_entrega: fechaHoy,
          estatus: "Pendiente",
        },
        {
          onSuccess: async (apoyoCreado) => {
            try {
              if (archivoComprobante) {
                const documentoData = new FormData();

                documentoData.append(
                  "nombre_documento",
                  `ComprobanteApoyo${apoyoSeleccionado.id_apoyo}`
                    .replace(/[^a-zA-Z0-9-]/g, "")
                );

                documentoData.append(
                  "tipo_documento",
                  "Apoyo"
                );

                documentoData.append(
                  "id_expediente",
                  dataT?.id_expediente
                );

                documentoData.append(
                  "archivo",
                  archivoComprobante
                );
                console.log("=== DOCUMENTO A GUARDAR ===");

                for (const [key, value] of documentoData.entries()) {
                  if (value instanceof File) {
                    console.log(key, {
                      name: value.name,
                      type: value.type,
                      size: value.size,
                    });
                  } else {
                    console.log(key, value);
                  }
                }

                await subirDocumentoMutation.mutateAsync(
                  documentoData
                );
              }

              resetFormYAlerta();
              setArchivoComprobante(null);

              lanzarModalResultado(
                "success",
                "Apoyo registrado",
                "El apoyo económico fue agregado correctamente."
              );
            } catch {
              lanzarModalResultado(
                "error",
                "Error",
                "El apoyo se creó pero no se pudo subir el comprobante."
              );
            }
          },
          onError: (error) => {
            setModalConfirmacion(false);
            lanzarModalResultado("error", "Error al registrar", error?.response?.data?.message || "No se pudo registrar el apoyo económico.");
          }
        }
      );
    }

    // EDITAR
    // EDITAR
    if (accionPendiente === "editar") {
      actualizarApoyoMutation.mutate(
        {
          id: apoyoSeleccionado.id_apoyo,
          payload: {
            concepto: formData.concepto,
            monto: Number(formData.monto),
          },
        },
        {
          onSuccess: async () => {
            try {
              if (archivoComprobante) {
                const documentoExistente = documentos?.find(
                  (doc) =>
                    doc.tipo_documento === "Apoyo" &&
                    doc.nombre_documento ===
                    `ComprobanteApoyo${apoyoSeleccionado.id_apoyo}`
                      .replace(/[^a-zA-Z0-9-]/g, "")
                );

                const documentoData = new FormData();

                documentoData.append(
                  "nombre_documento",
                  `ComprobanteApoyo${apoyoSeleccionado.id_apoyo}`
                    .replace(/[^a-zA-Z0-9-]/g, "")
                );

                documentoData.append(
                  "tipo_documento",
                  "Apoyo"
                );

                documentoData.append(
                  "id_expediente",
                  dataT?.id_expediente
                );

                documentoData.append(
                  "archivo",
                  archivoComprobante
                );
                console.log("id_expediente:", dataT?.id_expediente);
                console.log("tipo:", typeof dataT?.id_expediente);

                if (documentoExistente) {
                  await actualizarDocumentoMutation.mutateAsync({
                    id_documento: documentoExistente.id_documento,
                    formData: documentoData,
                  });
                } else {
                  console.log("=== DOCUMENTO A GUARDAR ===");

                  for (const [key, value] of documentoData.entries()) {
                    if (value instanceof File) {
                      console.log(key, {
                        name: value.name,
                        type: value.type,
                        size: value.size,
                      });
                    } else {
                      console.log(key, value);
                    }
                  }
                  await subirDocumentoMutation.mutateAsync(
                    documentoData
                  );
                }
              }

              resetFormYAlerta();
              setArchivoComprobante(null);

              lanzarModalResultado(
                "success",
                "Apoyo actualizado",
                "El apoyo económico fue actualizado correctamente."
              );
            } catch (err) {
              console.log(err)
              lanzarModalResultado(
                "error",
                "Error",
                "El apoyo fue actualizado pero ocurrió un problema con el comprobante."
              );
            }
          },
          onError: () => {
            setModalConfirmacion(false);

            lanzarModalResultado(
              "error",
              "Error al actualizar",
              "No se pudo actualizar el apoyo."
            );
          },
        }
      );
    }

    // ELIMINAR
    if (accionPendiente === "eliminar") {
      eliminarApoyoMutation.mutate(apoyoSeleccionado.id_apoyo, {
        onSuccess: () => {
          setModalConfirmacion(false);
          lanzarModalResultado("success", "Apoyo eliminado", "El apoyo económico fue eliminado correctamente.");
        },
        onError: () => {
          setModalConfirmacion(false);
          lanzarModalResultado("error", "Error al eliminar", "No se pudo eliminar el apoyo.");
        }
      });
    }

    // ENTREGAR
    if (accionPendiente === "entregar") {
      entregarApoyoMutation.mutate(
        {
          id: apoyoSeleccionado.id_apoyo,
          payload: { // Ajustado a 'payload' para coincidir con tu hook
            estatus: "Entregado",
            fecha_entrega: fechaHoy,
          },
        },
        {
          onSuccess: () => {
            setModalConfirmacion(false);
            lanzarModalResultado("success", "Apoyo entregado", "El apoyo fue marcado como entregado.");
          },
          onError: () => {
            setModalConfirmacion(false);
            lanzarModalResultado("error", "Error", "No se pudo actualizar el apoyo.");
          }
        }
      );
    }
  };

  return (
    <>
      <div className="mt-4 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <HandCoins className="w-4 h-4 text-teal-600" />
                Reembolsos
              </h3>
              <p className="text-xs text-slate-500 mt-1">Historial de apoyos entregados</p>
            </div>

            <Boton
              onClick={() => {
                setModoEdicion(false);
                setFormData({ concepto: "", monto: "" });
                setAlerta({ open: false, mensaje: "", tipo: "error" });
                setModalCrear(true);
              }}
            >
              Agregar Reembolso
            </Boton>
          </div>

          <ApoyoFiltros
            search={search}
            filters={{}}
            onSearchChange={handleSearchChange}
            onFilterChange={() => { }}
            onClearFilters={() => {
              setSearch("");
              setCurrentPage(1);
            }}
          />
        </div>

        <ApoyoTabla
          donativos={apoyosPaginados.map((apoyo) => {
            const comprobante = documentos?.find(
              (doc) =>
                doc.tipo_documento === "Apoyo" &&
                doc.nombre_documento ===
                `ComprobanteApoyo${apoyo.id_apoyo}`.replace(
                  /[^a-zA-Z0-9-]/g,
                  ""
                )
            );

            return {
              ...apoyo,
              fecha: apoyo.fecha_entrega,
              comprobante,
            };
          })}
          onEditar={(item) => {
            setModoEdicion(true);
            setApoyoSeleccionado(item);
            setFormData({
              concepto: item.concepto || "",
              monto: item.monto || "",
            });
            setAlerta({
              open: false,
              mensaje: "",
              tipo: "error",
            });
            setModalCrear(true);
          }}
          onEliminar={(item) => {
            setApoyoSeleccionado(item);
            setAccionPendiente("eliminar");
            setModalConfirmacion(true);
          }}
          onEntregar={(item) => {
            setApoyoSeleccionado(item);
            setAccionPendiente("entregar");
            setModalConfirmacion(true);
          }}
        />

        <PaginacionTabla
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={apoyosFiltrados.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* MODAL CREAR / EDITAR */}

      {modalCrear && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-2xl">
            <div className={ui.modal.formContainer}>

              {/* HEADER */}
              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-teal-600/10 text-teal-600`}>
                  <HandCoins className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>
                    {modoEdicion ? "Editar reembolso económico" : "Agregar reembolso económico"}
                  </h2>
                  <p className={ui.modal.description}>
                    {modoEdicion
                      ? "Modifica la información del reembolso"
                      : "Completa la información del reembolso"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setModalCrear(false);
                    setArchivoComprobante(null);
                    setAlerta({ open: false, mensaje: "", tipo: "error" });
                  }}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              {/* BODY */}
              <div className={ui.modal.formBody}>

                {/* ALERTA */}
                {alerta?.open && (
                  <Alerta
                    mensaje={alerta.mensaje}
                    tipo={alerta.tipo}
                    onClose={() =>
                      setAlerta({ ...alerta, open: false })
                    }
                  />
                )}

                <div className={ui.modal.formScroll}>

                  <div className="grid grid-cols-1 gap-6">

                    {/* CONCEPTO */}
                    <Field label="Concepto" required>
                      <Input
                        value={formData.concepto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            concepto: e.target.value,
                          })
                        }
                        placeholder="Ej. Uniforme escolar"
                      />
                    </Field>

                    {/* MONTO */}
                    <Field label="Monto" required>
                      <Input
                        type="number"
                        value={formData.monto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monto: e.target.value,
                          })
                        }
                        placeholder="0.00"
                      />
                    </Field>

                    {/* COMPROBANTE */}
                    <Field label="Comprobante (opcional)">
                      {modoEdicion && (() => {
                        const documentoExistente = documentos?.find(
                          (doc) =>
                            doc.tipo_documento === "Apoyo" &&
                            doc.nombre_documento ===
                            `ComprobanteApoyo${apoyoSeleccionado.id_apoyo}`
                              .replace(/[^a-zA-Z0-9-]/g, "")
                        );

                        return documentoExistente ? (
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                            <p className="text-xs text-slate-600 mb-1">
                              Comprobante actual:
                            </p>

                            <a
                              href={`http://localhost:8000${documentoExistente.archivo}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline font-medium"
                            >
                              Ver comprobante actual
                            </a>

                            <p className="mt-2 text-xs text-slate-500">
                              Si subes uno nuevo, reemplazará el anterior.
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                            Este apoyo aún no tiene comprobante registrado.
                          </div>
                        );
                      })()}

                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          setArchivoComprobante(e.target.files?.[0] || null)
                        }
                      />

                      {archivoComprobante && (
                        <p className="text-xs text-green-600 mt-2">
                          Archivo seleccionado: {archivoComprobante.name}
                        </p>
                      )}
                    </Field>

                  </div>
                </div>

                {/* FOOTER */}
                <div className={ui.modal.formActions}>
                  <BotonPrincipal
                    variant="secondary"
                    onClick={() => {
                      setModalCrear(false);
                      setArchivoComprobante(null);
                    }}
                  >
                    Cancelar
                  </BotonPrincipal>

                  <BotonPrincipal onClick={handleGuardarApoyo}>
                    {modoEdicion ? "Guardar cambios" : "Continuar"}
                  </BotonPrincipal>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION */}
      <ModalConfirmacion
        open={modalConfirmacion}
        title={
          accionPendiente === "editar" ? "Editar apoyo" :
            accionPendiente === "eliminar" ? "Eliminar apoyo" :
              accionPendiente === "entregar" ? "Confirmar entrega" : "Agregar apoyo económico"
        }
        description={
          accionPendiente === "editar" ? "¿Deseas guardar los cambios del apoyo?" :
            accionPendiente === "eliminar" ? "¿Deseas eliminar este apoyo económico?" :
              accionPendiente === "entregar" ? "¿Deseas marcar este apoyo como entregado?" : "¿Deseas registrar este apoyo económico?"
        }
        confirmText={
          accionPendiente === "editar" ? "Guardar" :
            accionPendiente === "eliminar" ? "Eliminar" :
              accionPendiente === "entregar" ? "Confirmar" : "Agregar"
        }
        cancelText="Cancelar"
        onClose={() => setModalConfirmacion(false)}
        onConfirm={confirmarAccion}
        loading={
          crearApoyoMutation.isPending ||
          actualizarApoyoMutation.isPending ||
          eliminarApoyoMutation.isPending ||
          entregarApoyoMutation.isPending
        }
        color={
          accionPendiente === "eliminar" ? "red" :
            accionPendiente === "entregar" ? "green" : "teal"
        }
      />

      {/* MODAL RESULTADO */}
      <ModalResultado
        open={modalResultado.open}
        type={modalResultado.type}
        title={modalResultado.title}
        message={modalResultado.message}
        onClose={() => setModalResultado({ ...modalResultado, open: false })}
      />
    </>
  );
}

