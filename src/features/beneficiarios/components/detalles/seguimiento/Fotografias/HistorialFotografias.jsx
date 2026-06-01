
import { useRef, useState } from "react";

import {
  Camera,
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

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { obtenerSeguimientosPorBeneficiario } from "../../../../services/seguimientoService";

import { obtenerPeriodos } from "../../../../../periodos/services/periodoService";

import { subirFotografia } from "../../../../../expedientes/services/fotografiaService";

export default function HistorialFotografias({ data, refetch }) {

  const queryClient =
    useQueryClient();

  const id_beneficiario =
    data?.id_beneficiario;

  const id_expediente =
    data?.id_expediente;

  const {
    data: seguimientos = [],
    isLoading: loadingSeg,
  } = useQuery({
    queryKey: [
      "seguimientos",
      id_beneficiario,
    ],

    queryFn: () =>
      obtenerSeguimientosPorBeneficiario(
        id_beneficiario
      ),

    enabled: !!id_beneficiario,
  });

  const {
    data: periodos = [],
    isLoading: loadingPer,
  } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });

  const [preview, setPreview] =
    useState(null);

  const [descripcion,
    setDescripcion] =
    useState("");

  const [seguimientoActivo,
    setSeguimientoActivo] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  // 🔥 CARRUSEL
  const [fotoActiva,
    setFotoActiva] =
    useState({});

  // 🔥 MODAL FOTO
  const [modalFoto,
    setModalFoto] =
    useState(null);

  const inputRef =
    useRef(null);

  if (
    loadingSeg ||
    loadingPer
  ) {
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

  const listaOrdenada = [
    ...seguimientos,
  ].sort((a, b) => {

    const indexA =
      periodos.findIndex(
        (p) =>
          p.id_periodo ===
          a.id_periodo
      );

    const indexB =
      periodos.findIndex(
        (p) =>
          p.id_periodo ===
          b.id_periodo
      );

    return indexA - indexB;
  });

  const seleccionarArchivo =
    (seguimiento) => {

      setSeguimientoActivo(
        seguimiento
      );

      inputRef.current?.click();
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

    setSeguimientoActivo(
      null
    );

    if (inputRef.current) {
      inputRef.current.value =
        null;
    }
  };

  // 🔥 SIGUIENTE FOTO
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

  // 🔥 FOTO ANTERIOR
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

  // 🔥 DESCARGAR FOTO
  const descargarFoto =
    async (
      url,
      nombre =
        "fotografia.jpg"
    ) => {

      try {

        const response =
          await fetch(url);

        const blob =
          await response.blob();

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = blobUrl;

        link.download =
          nombre;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          blobUrl
        );

      } catch (error) {
        console.error(error);
      }
    };

  const confirmarSubida =
    async () => {

      if (!preview) return;

      if (
        !descripcion.trim()
      ) {

        alert(
          "Escribe una descripción"
        );

        return;
      }

      try {

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

        await subirFotografia(
          formData
        );
        await refetch();

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "seguimientos",
              id_beneficiario,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "expediente",
              id_expediente,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "beneficiarios",
              id_beneficiario,
            ],
          }),
        ]);

        cancelar();

      } catch (error) {

        console.error(error);

        alert(
          "Error subiendo fotografía"
        );

      } finally {

        setSaving(false);
      }
    };

  return (
    <>
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">

        {/* HEADER */}
        <div className="mb-6">

          <h3 className="text-lg font-bold text-slate-800">
            Historial Fotográfico
          </h3>

          <p className="text-sm text-slate-500">
            Fotografías organizadas
            por etapa
          </p>
        </div>

        {/* GRID */}
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

              // 🔥 FILTRAR
              const fotos =
                (
                  data?.fotografias ||
                  []
                ).filter(
                  (foto) =>
                    foto.etapa ===
                    periodo?.ciclo_escolar
                );

              // 🔥 INDEX
              const currentIndex =
                fotoActiva[
                seguimiento.id_seguimiento
                ] || 0;

              // 🔥 FOTO ACTUAL
              const fotoActual =
                fotos[
                currentIndex
                ];

              const actual =
                index === 0;

              const abierto =
                seguimientoActivo
                  ?.id_seguimiento ===
                seguimiento.id_seguimiento;

              return (
                <div
                  key={
                    seguimiento.id_seguimiento
                  }
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white hover:shadow-xl transition-all duration-300"
                >

                  {/* TOP */}
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
                  </div>

                  {/* FOTO */}
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
                              index:
                                currentIndex,
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
                    {abierto &&
                      preview && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">

                          <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-slate-700">
                              Nueva fotografía
                            </p>

                            <button
                              onClick={
                                cancelar
                              }
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X
                                size={
                                  16
                                }
                              />
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Descripción..."
                            value={
                              descripcion
                            }
                            onChange={(
                              e
                            ) =>
                              setDescripcion(
                                e.target
                                  .value
                              )
                            }
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                          />

                          <div className="flex gap-2">

                            <button
                              onClick={
                                confirmarSubida
                              }
                              disabled={
                                saving
                              }
                              className="flex-1 h-10 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
                            >

                              {saving ? (
                                <Loader2
                                  size={
                                    16
                                  }
                                  className="animate-spin mx-auto"
                                />
                              ) : (
                                "Subir foto"
                              )}
                            </button>

                            <button
                              onClick={
                                cancelar
                              }
                              className="px-4 h-10 rounded-xl bg-slate-100 text-sm font-medium hover:bg-slate-200 transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* INPUT */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {/* 🔥 MODAL FOTO */}
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

          {/* IZQUIERDA */}
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

          {/* IMAGEN */}
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

          {/* DERECHA */}
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

          {/* FOOTER */}
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
        </div>
      )}
    </>
  );
}

