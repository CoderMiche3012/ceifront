import { useMemo, useRef, useState } from "react";
import { Eye, Download, Trash2, FileText, Image as ImageIcon, Plus, } from "lucide-react";

import { ui } from "../../../../../../styles/ui/uiClasses";
import DatosTabla from "../../../../../../components/tablas/DatosTabla";
import FiltrosTabla from "../../../../../../components/tablas/FiltrosTabla";
import PaginacionTabla from "../../../../../../components/tablas/PaginacionTabla";
import AccionesTabla from "../../../../../../components/tablas/AccionesTabla";
import Boton from "../../../../../../components/ui/BotonInterno";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../components/shared/ModalResultado";
import { usePermissions } from "../../../../../../context/PermissionsContext";

import { useSubirDocumento, useEliminarDocumento } from "../../../../../expedientes/hooks/useDocumentos";

const PAGE_SIZE = 10;

export default function ExpedienteDigital({ data }) {
  const { hasModulePermission, Do: isPermsDo, } = usePermissions();
  const canDeleteDocumentos = hasModulePermission("documentos", "eliminar");
  const canCreateDocumentos = hasModulePermission("documentos", "crear")
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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [DoDocumeto, setDoDocumeto] = useState(false);

  const inputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const id_expediente = data?.id_expediente;
  const documentos = data?.documentos ?? [];
  const uploadMutation = useSubirDocumento();
  const deleteMutation = useEliminarDocumento();
  const limpiarNombreDocumento =
    (nombre) => {

      return nombre
        .replace(/\.[^/.]+$/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "");
    };

  const confirmarSubida = async () => {
    if (!pendingFile) return;
    setConfirmOpen(false);
    try {
      setDoDocumeto(true);
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
      const mensaje =
        error?.errors?.archivo?.[0] ||
        error?.message ||
        "Error al subir documento";
      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: mensaje || "No se pudo subir el documento.",
      });
    } finally {
      setDoDocumeto(false);
      setConfirmOpen(false);
      setPendingFile(null);
      setSelectedFile(null);
      setShowUploadModal(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowUploadModal(true);
  };
  const cancelarUpload = () => {
    setSelectedFile(null);
    setShowUploadModal(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  const guardarDocumento = () => {
    if (!selectedFile) return;

    setPendingFile(selectedFile);
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
        alert("Error al descargar");
      }
    };

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


  const renderCell = (
    row,
    key
  ) => {

    switch (key) {

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

      case "tipo":

        return (
          <span className="text-sm text-slate-500">
            {obtenerFormato(
              row.archivo
            )}
          </span>
        );

      case "fecha":

        return (
          <span className="text-sm text-slate-500">
            {
              row.fecha_carga
            }
          </span>
        );

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
                    window.open(row.archivo, "_blank"),
              },

              {
                label:
                  "Descargar",

                icon: (
                  <Download size={16} />
                ),

                onClick: (row) =>
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

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

      <DatosTabla
        columns={columns}
        data={paginados}
        renderCell={renderCell}
        rowKey="id_documento"
      />

      <PaginacionTabla
        currentPage={page}
        totalPages={totalPages}
        totalItems={
          filtrados.length
        }
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

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
      {DoDocumeto && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center min-w-[320px]">

            <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h3 className="font-semibold text-slate-800">
              Procesando documento...
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
      {showUploadModal && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-xl">
            <div className={ui.modal.formContainer}>

              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
                  <FileText size={24} />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>
                    Agregar Documento
                  </h2>

                  <p className={ui.modal.description}>
                    Selecciona el documento que deseas subir
                  </p>
                </div>
              </div>

              <div className={ui.modal.formBody}>
                <div className="space-y-4">

                  {!selectedFile ? (
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-10 text-slate-500 hover:border-teal-500 hover:text-teal-600 transition"
                    >
                      Seleccionar documento
                    </button>
                  ) : (
                    <div className="border rounded-xl p-4 bg-slate-50">
                      <p className="font-medium text-slate-700">
                        {selectedFile.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}

                </div>

                <div className={ui.modal.formActions}>
                  <button
                    onClick={cancelarUpload}
                    className="px-4 py-2 rounded-xl bg-slate-100"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={guardarDocumento}
                    disabled={!selectedFile}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white"
                  >
                    Guardar Documento
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>

  );


}

