import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Eye,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  Plus,
} from "lucide-react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import DatosTabla from "../../../../../../components/tablas/DatosTabla";
import FiltrosTabla from "../../../../../../components/tablas/FiltrosTabla";
import PaginacionTabla from "../../../../../../components/tablas/PaginacionTabla";
import AccionesTabla from "../../../../../../components/tablas/AccionesTabla";
import Boton from "../../../../../../components/ui/BotonInterno";

import {
  obtenerDocumentos,
  subirDocumento,
  eliminarDocumento,
} from "../../../../../../features/expedientes/services/documentosService";

const PAGE_SIZE = 10;

export default function ExpedienteDigital({
  data,
}) {

  const queryClient =
    useQueryClient();

  const inputRef =
    useRef(null);

  const [search,
    setSearch] =
    useState("");

  const [page,
    setPage] =
    useState(1);

  // 🔥 SOLO TOMAMOS EL ID
  const id_expediente =
    data?.id_expediente;

  // =========================
  // QUERY
  // =========================

  const {
    data: documentos = [],
    isLoading,
  } = useQuery({
    queryKey: [
      "documentos",
      id_expediente,
    ],

    queryFn: () =>
      obtenerDocumentos(
        id_expediente
      ),

    enabled:
      !!id_expediente,
  });

  // =========================
  // SUBIR
  // =========================

  const uploadMutation =
    useMutation({
      mutationFn:
        subirDocumento,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "documentos",
            id_expediente,
          ],
        });
      },
    });

  // =========================
  // ELIMINAR
  // =========================

  const deleteMutation =
    useMutation({
      mutationFn:
        eliminarDocumento,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "documentos",
            id_expediente,
          ],
        });
      },
    });

  // =========================
  // SUBIR ARCHIVO
  // =========================
const limpiarNombreDocumento =
  (nombre) => {

    return nombre
      // quitar extensión
      .replace(
        /\.[^/.]+$/,
        ""
      )

      // quitar acentos
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      // SOLO letras y números
      .replace(
        /[^a-zA-Z0-9]/g,
        ""
      );
  };

  const handleFile =
    async (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      try {

        const formData =
          new FormData();

        formData.append(
          "archivo",
          file
        );

        const nombreLimpio =
          limpiarNombreDocumento(
            file.name
          );

        formData.append(
          "nombre_documento",
          nombreLimpio
        );



        formData.append(
          "tipo_documento",
          "General"
        );

        formData.append(
          "id_expediente",
          id_expediente
        );

        await uploadMutation.mutateAsync(
          formData
        );

        if (inputRef.current) {
          inputRef.current.value =
            "";
        }

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Error subiendo archivo"
        );
      }
    };

  // =========================
  // DESCARGAR
  // =========================

  const descargarArchivo =
    async (url, nombre) => {

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

        link.href =
          blobUrl;

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

        console.error(
          error
        );
      }
    };

  // =========================
  // ELIMINAR
  // =========================

  const handleDelete =
    async (row) => {

      const confirmar =
        window.confirm(
          "¿Eliminar documento?"
        );

      if (!confirmar)
        return;

      try {

        await deleteMutation.mutateAsync(
          row.id_documento
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Error eliminando documento"
        );
      }
    };

  // =========================
  // FILTRADO
  // =========================

  const filtrados =
  useMemo(() => {

    return documentos.filter(
      (doc) => {

        // 🔥 SOLO documentos del expediente actual
        if (
          doc.id_expediente !==
          id_expediente
        ) {
          return false;
        }

        // 🔥 ocultar boletas
        if (
          doc.tipo_documento
            ?.toLowerCase() ===
          "boleta"
        ) {
          return false;
        }

        // 🔥 búsqueda
        return doc.nombre_documento
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );
      }
    );

  }, [
    documentos,
    search,
    id_expediente,
  ]);
  // =========================
  // PAGINACIÓN
  // =========================

  const totalPages =
    Math.ceil(
      filtrados.length /
      PAGE_SIZE
    );

  const paginados =
    filtrados.slice(
      (page - 1) *
      PAGE_SIZE,
      page * PAGE_SIZE
    );

  // =========================
  // COLUMNAS
  // =========================

  const columns = [
    {
      key: "nombre",
      label:
        "NOMBRE DEL DOCUMENTO",
    },

    {
      key: "tipo",
      label: "FORMATO",
    },

    {
      key: "fecha",
      label:
        "FECHA DE CARGA",
    },

    {
      key: "acciones",
      label: "ACCIONES",
    },
  ];

  // =========================
  // TIPO ARCHIVO
  // =========================

  const obtenerFormato =
    (archivo) => {

      return archivo
        ?.split(".")
        .pop()
        ?.toUpperCase();
    };

  const esImagen =
    (archivo) => {

      return /\.(jpg|jpeg|png|webp)$/i.test(
        archivo
      );
    };

  // =========================
  // RENDER CELL
  // =========================

  const renderCell = (
    row,
    key
  ) => {

    switch (key) {

      // =====================
      // NOMBRE
      // =====================

      case "nombre":

        return (
          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">

              {esImagen(
                row.archivo
              ) ? (

                <ImageIcon
                  size={18}
                  className="text-orange-500"
                />

              ) : (

                <FileText
                  size={18}
                  className="text-red-500"
                />
              )}
            </div>

            <div>

              <p className="font-medium text-slate-700">
                {
                  row.nombre_documento
                }
              </p>

              <p className="text-xs text-slate-400">
                Documento
                general
              </p>
            </div>
          </div>
        );

      // =====================
      // FORMATO
      // =====================

      case "tipo":

        return (
          <span className="text-sm text-slate-500">
            {obtenerFormato(
              row.archivo
            )}
          </span>
        );

      // =====================
      // FECHA
      // =====================

      case "fecha":

        return (
          <span className="text-sm text-slate-500">
            {
              row.fecha_carga
            }
          </span>
        );

      // =====================
      // ACCIONES
      // =====================

      case "acciones":

        return (
          <AccionesTabla
            row={row}
            actions={[
              {
                label:
                  "Ver",

                icon: (
                  <Eye size={16} />
                ),

                onClick:
                  (row) =>
                    window.open(
                      row.archivo,
                      "_blank"
                    ),
              },

              {
                label:
                  "Descargar",

                icon: (
                  <Download size={16} />
                ),

                onClick:
                  (row) =>
                    descargarArchivo(
                      row.archivo,
                      row.nombre_documento
                    ),
              },

              {
                label:
                  "Eliminar",

                icon: (
                  <Trash2
                    size={16}
                  />
                ),

                className:
                  "hover:text-red-600",

                onClick:
                  handleDelete,
              },
            ]}
          />
        );

      default:
        return row[key];
    }
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">

        <p className="text-sm text-slate-500">
          Cargando documentos...
        </p>
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h3 className="text-lg font-bold text-slate-800">
            Expediente Digital
          </h3>

          <p className="text-sm text-slate-500">
            Documentos y fotografías
            del beneficiario
          </p>
        </div>

        <Boton
          icon={<Plus size={16} />}
          onClick={() =>
            inputRef.current?.click()
          }
        >
          Nuevo Documento
        </Boton>
      </div>

      {/* FILTROS */}

      <FiltrosTabla
        searchValue={search}
        onSearchChange={
          setSearch
        }
        searchPlaceholder="Buscar documento..."
        filters={[]}
        onClearFilters={() => {

          setSearch("");
          setPage(1);
        }}
      />

      {/* TABLA */}

      <DatosTabla
        columns={columns}
        data={paginados}
        renderCell={renderCell}
        rowKey="id_documento"
      />

      {/* PAGINACIÓN */}

      <PaginacionTabla
        currentPage={page}
        totalPages={totalPages}
        totalItems={
          filtrados.length
        }
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* INPUT */}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}


