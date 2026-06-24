import { useRef, useState } from "react";

import {
  Camera,
  Trash2,
  Plus,
  ImagePlus,
  Calendar,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
} from "lucide-react";

import { useSubirFotografia, useEliminarFotografia } from "../../../../../expedientes/hooks/useFotografias";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";
import { usePermissions } from "../../../../../../context/PermissionsContext";
import { ui } from "../../../../../../styles/ui/uiClasses";

export default function HistorialFotografias({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditFotografias = hasModulePermission("fotografias", "eliminar");
  const canCreateFotografias = hasModulePermission("fotografias", "crear")
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const id_beneficiario = data?.id_beneficiario;
  const id_expediente = data?.id_expediente;
  const periodoActivo = data?.periodoActivo
  const seguimientos = data?.historial_seguimientos ?? []
  const periodos = data?.periodos ?? []
  const { mutateAsync: subirFoto } = useSubirFotografia(id_expediente);
  const { mutateAsync: eliminarFoto } = useEliminarFotografia(id_expediente);
  const [preview, setPreview] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [seguimientoActivo, setSeguimientoActivo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fotoActiva, setFotoActiva] = useState({});
  const [modalFoto, setModalFoto] = useState(null);
  const inputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [fotoAEliminar, setFotoAEliminar] = useState(null);
  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  if (!data) {
    return (
      <div className="rounded-3xl bg-white p-6 border border-slate-200">
        <p className="text-sm text-slate-500">
          Cargando historial...
        </p>
      </div>
    );
  }

  const periodosMap =
    Object.fromEntries(
      periodos.map((p) => [
        p.id_periodo,
        p,
      ])
    );

  const listaOrdenada = [...seguimientos].sort((a, b) => {
    const aEsActivo = a.id_periodo === periodoActivo?.id_periodo;
    const bEsActivo = b.id_periodo === periodoActivo?.id_periodo;

    // periodo activo siempre primero
    if (aEsActivo && !bEsActivo) return -1;
    if (!aEsActivo && bEsActivo) return 1;
    return b.id_periodo - a.id_periodo;
  });

  const seleccionarArchivo = (seguimiento) => {
    setSeguimientoActivo(seguimiento);
    setShowModal(true);
  };

  const handleFile = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setPreview(file);
  };

  const cancelar = () => {
    setPreview(null);
    setDescripcion("");
    setSeguimientoActivo(null);
    setShowModal(false);

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const siguienteFoto = (
    seguimientoId,
    total
  ) => {

    setFotoActiva((prev) => ({
      ...prev,

      [seguimientoId]:
        (
          (
            prev[
            seguimientoId
            ] || 0
          ) + 1
        ) % total,
    }));
  };

  const anteriorFoto = (
    seguimientoId,
    total
  ) => {

    setFotoActiva((prev) => ({
      ...prev,

      [seguimientoId]:
        (
          (
            prev[
            seguimientoId
            ] || 0
          ) -
          1 +
          total
        ) % total,
    }));
  };

  const descargarFoto = async (url, nombre = "fotografia.jpg") => {
    try {
      const response = await fetch(url);

      if (!response.ok) return;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = nombre;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error descargando imagen:", error);
    }
  };

  const confirmarSubida =
    async () => {

      if (!preview) return;

      if (!descripcion.trim()) {
        setResultado({
          open: true,
          type: "error",
          title: "Descripción requerida",
          message: "Debes escribir una descripción para la fotografía.",
        });

        setShowConfirm(false);
        return;
      }

      try {
        setShowConfirm(false);
        setLoadingFoto(true);

        setSaving(true);

        const periodo =
          periodosMap[
          seguimientoActivo
            ?.id_periodo
          ];

        const formData =
          new FormData();

        formData.append(
          "foto_archivo",
          preview
        );

        formData.append(
          "id_expediente",
          id_expediente
        );

        formData.append(
          "etapa",
          periodo?.ciclo_escolar
        );

        formData.append(
          "descripcion",
          descripcion
        );

        await subirFoto(
          formData
        );

        setResultado({
          open: true,
          type: "success",
          title: "Fotografía agregada",
          message: "La fotografía se guardó correctamente.",
        });

        cancelar();

      } catch (error) {
        setShowConfirm(false);

        setResultado({
          open: true,
          type: "error",
          title: "Error",
          message:
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            "Error al subir la fotografía.",
        });

      } finally {
        setLoadingFoto(false);

        setSaving(false);
      }
    };
  const eliminarFotografiaActual = async () => {
    try {
      if (!fotoAEliminar) return;

      await eliminarFoto(fotoAEliminar.id_foto);

      const nuevasFotos = modalFoto.fotos.filter(
        (f) => f.id_foto !== fotoAEliminar.id_foto
      );

      if (nuevasFotos.length === 0) {
        setModalFoto(null);
      } else {
        const newIndex = Math.min(modalFoto.index, nuevasFotos.length - 1);

        setModalFoto({
          fotos: nuevasFotos,
          index: newIndex,
          seguimiento: modalFoto.seguimiento,
        });
      }

      setShowDeleteConfirm(false);
      setFotoAEliminar(null);

      setResultado({
        open: true,
        type: "success",
        title: "Fotografía eliminada",
        message: "La fotografía se eliminó correctamente.",
      });

    } catch (error) {
      setShowDeleteConfirm(false);
      setFotoAEliminar(null);

      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: "No fue posible eliminar la fotografía.",
      });
    }
  };
  const handleSelectFile = () => {

    inputRef.current?.click();
  };
  return (
    <>
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">

        <div className="mb-6">

          <h3 className="text-lg font-bold text-slate-800">
            Historial Fotográfico
          </h3>

          <p className="text-sm text-slate-500">
            Fotografías organizadas
            por etapa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {listaOrdenada.map(
            (
              seguimiento,
              index
            ) => {

              const periodo =
                periodosMap[
                seguimiento
                  .id_periodo
                ];

              const fotos =
                (
                  data?.fotografias ||
                  []
                ).filter(
                  (foto) =>
                    foto.etapa ===
                    periodo?.ciclo_escolar
                );

              const currentIndex =
                fotoActiva[
                seguimiento.id_seguimiento
                ] || 0;

              const fotoActual =
                fotos[
                currentIndex
                ];

              const actual = index === 0;

              const seguimientoActivoEstatus = seguimiento.estatus === "Activo";

              const abierto = seguimientoActivo?.id_seguimiento === seguimiento.id_seguimiento;

              return (
                <div
                  key={
                    seguimiento.id_seguimiento
                  }
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white hover:shadow-xl transition-all duration-300"
                >

                  <div className="flex items-center justify-between p-4 pb-3">

                    <div>

                      <div className="flex items-center gap-2">

                        <h4 className="font-bold text-slate-800">

                          {periodo?.ciclo_escolar ||
                            "Periodo"}

                        </h4>

                        {actual && (
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700">
                            ACTUAL
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        Etapa de seguimiento
                      </p>
                    </div>
                    {canCreateFotografias &&
                      seguimientoActivoEstatus && (
                        <button
                          onClick={() =>
                            seleccionarArchivo(
                              seguimiento
                            )
                          }
                          className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center hover:scale-105 transition"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                  </div>

                  <div className="relative h-64 bg-slate-100 overflow-hidden">

                    {!fotoActual ? (

                      <div className="h-full flex flex-col items-center justify-center text-center p-6">

                        <ImagePlus
                          size={40}
                          className="text-slate-300 mb-3"
                        />

                        <p className="font-semibold text-slate-500">
                          Sin fotografías
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Agrega evidencia
                          fotográfica
                        </p>
                      </div>

                    ) : (

                      <>
                        <img
                          src={
                            fotoActual.foto_archivo
                          }
                          alt=""
                          onClick={() =>
                            setModalFoto({
                              fotos,
                              index: currentIndex,
                              seguimiento,
                            })
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                        />

                        {/* EXPANDIR */}
                        <button
                          onClick={() =>
                            setModalFoto({
                              fotos,
                              index:
                                currentIndex,
                            })
                          }
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur flex items-center justify-center hover:bg-black/60 transition"
                        >
                          <Expand size={16} />
                        </button>

                        {/* BOTONES */}
                        {fotos.length >
                          1 && (
                            <>
                              <button
                                onClick={() =>
                                  anteriorFoto(
                                    seguimiento.id_seguimiento,
                                    fotos.length
                                  )
                                }
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur flex items-center justify-center hover:bg-black/60 transition"
                              >
                                ‹
                              </button>

                              <button
                                onClick={() =>
                                  siguienteFoto(
                                    seguimiento.id_seguimiento,
                                    fotos.length
                                  )
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur flex items-center justify-center hover:bg-black/60 transition"
                              >
                                ›
                              </button>
                            </>
                          )}

                        {/* INDICADORES */}
                        {fotos.length >
                          1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">

                              {fotos.map(
                                (
                                  _,
                                  i
                                ) => (
                                  <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all ${i === currentIndex
                                      ? "w-5 bg-white"
                                      : "w-2 bg-white/50"
                                      }`}
                                  />
                                )
                              )}
                            </div>
                          )}
                      </>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="p-4 space-y-3">

                    {/* FECHA */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">

                      <Calendar size={14} />

                      <span>
                        {fotoActual
                          ?.fecha_carga ||
                          "--"}
                      </span>
                      {fotoActual?.descripcion && (
                        <p className="text-sm text-slate-600">
                          {fotoActual.descripcion}
                        </p>
                      )}
                    </div>


                    {/* TOTAL */}
                    <div className="flex items-center gap-2">

                      <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">

                        <Camera
                          size={14}
                          className="text-teal-700"
                        />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-700">

                          {
                            fotos.length
                          }{" "}
                          fotos

                        </p>

                        <p className="text-xs text-slate-400">
                          Seguimiento
                          fotográfico
                        </p>
                      </div>
                    </div>

                    {/* FORM */}

                  </div>
                </div>
              );
            }
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {modalFoto && (

        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">

          {/* CERRAR */}
          <button
            onClick={() =>
              setModalFoto(
                null
              )
            }
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
          >
            <X size={20} />
          </button>

          {/* DESCARGAR */}
          <button
            onClick={() =>
              descargarFoto(
                modalFoto.fotos[
                  modalFoto.index
                ]
                  ?.foto_archivo,
                `fotografia-${modalFoto.index +
                1
                }.jpg`
              )
            }
            className="absolute top-5 right-20 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
          >
            <Download
              size={18}
            />
          </button>
          {canEditFotografias &&
            data.estatus_beneficiario === "Activo" && (
              <button
                onClick={() => {
                  const foto = modalFoto?.fotos?.[modalFoto?.index];
                  setFotoAEliminar(foto);
                  setShowDeleteConfirm(true);
                }}
                className="absolute top-5 right-35 h-11 w-11 rounded-full bg-red-500/80 text-white hover:bg-red-600 flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
            )}

          {modalFoto.fotos
            .length > 1 && (

              <button
                onClick={() =>
                  setModalFoto(
                    (
                      prev
                    ) => ({
                      ...prev,

                      index:
                        (
                          prev.index -
                          1 +
                          prev.fotos
                            .length
                        ) %
                        prev.fotos
                          .length,
                    })
                  )
                }
                className="absolute left-5 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
              >
                <ChevronLeft
                  size={24}
                />
              </button>
            )}

          <img
            src={
              modalFoto.fotos[
                modalFoto.index
              ]
                ?.foto_archivo
            }
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
          />

          {modalFoto.fotos
            .length > 1 && (

              <button
                onClick={() =>
                  setModalFoto(
                    (
                      prev
                    ) => ({
                      ...prev,

                      index:
                        (
                          prev.index +
                          1
                        ) %
                        prev.fotos
                          .length,
                    })
                  )
                }
                className="absolute right-5 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
              >
                <ChevronRight
                  size={24}
                />
              </button>
            )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur rounded-2xl px-5 py-3 text-white text-sm flex items-center gap-3">

            <Calendar
              size={16}
            />

            <span>
              {
                modalFoto.fotos[
                  modalFoto.index
                ]
                  ?.fecha_carga
              }
            </span>

            <span className="opacity-50">
              •
            </span>

            <span>
              {modalFoto.index +
                1}{" "}
              de{" "}
              {
                modalFoto.fotos
                  .length
              }
            </span>
          </div>
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

        </div>
      )}
      {showModal && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-2xl">
            <div className={ui.modal.formContainer}>

              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
                  <Camera size={24} />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>
                    Agregar Fotografía
                  </h2>

                  <p className={ui.modal.description}>
                    Adjunta una fotografía al seguimiento
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
                        onClick={handleSelectFile}
                        className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-12 text-slate-500 hover:border-teal-500 hover:text-teal-600 transition"
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

                    <input
                      type="text"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Describe la fotografía"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className={ui.modal.formActions}>
                  <button
                    onClick={cancelar}
                    className="px-4 py-2 rounded-xl bg-slate-100"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={!preview}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white"
                  >
                    Guardar Fotografía
                  </button>
                </div>
              </div>

            </div>
          </div>
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
        onConfirm={confirmarSubida}
      />

      {loadingFoto && (
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


