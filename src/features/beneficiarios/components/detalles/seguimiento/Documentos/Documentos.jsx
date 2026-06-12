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


import DatosTabla from "../../../../../../components/tablas/DatosTabla";
import FiltrosTabla from "../../../../../../components/tablas/FiltrosTabla";
import PaginacionTabla from "../../../../../../components/tablas/PaginacionTabla";
import AccionesTabla from "../../../../../../components/tablas/AccionesTabla";
import Boton from "../../../../../../components/ui/BotonInterno";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";
const API_URL =  "http://localhost:8000";

  

import { useSubirDocumento, useEliminarDocumento } from "../../../../../expedientes/hooks/useDocumentos";

const PAGE_SIZE = 10;

export default function ExpedienteDigital({
  data,
}) {
 const [confirmOpen, setConfirmOpen] = useState(false);
const [resultado, setResultado] = useState({
  open: false,
  type: "success",
  title: "",
  message: ""
});
const [confirmAction, setConfirmAction] = useState(null);
const [pendingDelete, setPendingDelete] = useState(null);
const [pendingFile, setPendingFile] = useState(null);

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

  const documentos = data?.documentos ?? [];

  // =========================
  // SUBIR
  // =========================

const uploadMutation = useSubirDocumento();
  // =========================
  // ELIMINAR
  // =========================

  const deleteMutation = useEliminarDocumento();

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

  const confirmarSubida = async () => {
  if (!pendingFile) return;

  try {
    const formData = new FormData();

    formData.append("archivo", pendingFile);

    const nombreLimpio = limpiarNombreDocumento(pendingFile.name);

    formData.append("nombre_documento", nombreLimpio);
    formData.append("tipo_documento", "General");
    formData.append("id_expediente", id_expediente);

    await uploadMutation.mutateAsync(formData);

    setResultado({
      open: true,
      type: "success",
      title: "Documento subido",
      message: "El archivo se cargó correctamente.",
    });

  } catch (error) {
    setResultado({
      open: true,
      type: "error",
      title: "Error",
      message: "No se pudo subir el documento.",
    });
  } finally {
    setConfirmOpen(false);
    setPendingFile(null);

    if (inputRef.current) inputRef.current.value = "";
  }
};
 const handleFile = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setPendingFile(file);
  setConfirmAction("upload");
  setConfirmOpen(true);
};
const handleConfirm = async () => {
  if (!confirmAction) return;
  if (confirmAction === "delete" && pendingDelete) {
    await confirmarDelete();
  }

  if (confirmAction === "upload" && pendingFile) {
    await confirmarSubida();
  }
};

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
const confirmarDelete = async () => {
  try {
    await deleteMutation.mutateAsync(pendingDelete.id_documento);

    setResultado({
      open: true,
      type: "success",
      title: "Eliminado",
      message: "Documento eliminado correctamente.",
    });

  } catch (error) {
    setResultado({
      open: true,
      type: "error",
      title: "Error",
      message: "No se pudo eliminar el documento.",
    });
  } finally {
    setConfirmOpen(false);
    setPendingDelete(null);
  }
};

  // =========================
  // FILTRADO
  // =========================
const filtrados = useMemo(() => {
  return documentos.filter((doc) => {
    const tipo =
      doc.tipo_documento?.toLowerCase();

    // ocultar boletas y estudios
    if (
      tipo === "boleta" ||
      tipo === "estudio" || tipo === "Apoyo"
    ) {
      return false;
    }

    return doc.nombre_documento
      ?.toLowerCase()
      .includes(search.toLowerCase());
  });
}, [documentos, search]);
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
                        `${API_URL}${row.archivo}`,
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
                      `${API_URL}${row.archivo}`,
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

                onClick: (row) => {
  setPendingDelete(row);
  setConfirmAction("delete");
  setConfirmOpen(true);
}
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


  // =========================
  // RENDER
  // =========================

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h3 className="text-lg font-bold text-slate-800">
            Documentacion del beneficiario
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
     <ModalConfirmacion
  open={confirmOpen}
  onClose={() => {
    setConfirmOpen(false);
    setPendingDelete(null);
    setPendingFile(null);
    setConfirmAction(null);
  }}
  onConfirm={handleConfirm}
  title={
    confirmAction === "delete"
      ? "Eliminar documento"
      : "Subir documento"
  }
  description={
    confirmAction === "delete"
      ? "¿Seguro que deseas eliminar este documento?"
      : "¿Deseas subir este documento?"
  }
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
    </div>
    
  );
  

}


onClick: (row) => {
  setPendingDelete(row);
  setConfirmAction("delete");
  setConfirmOpen(true);
}