import { Pencil, Plus, Users, Check, X, Trash2 } from "lucide-react";

import React, { useState } from "react";

import BotonInterno from "../../../../components/ui/BotonInterno";
import DatosTabla from "../../../../components/tablas/DatosTabla";
import FiltrosTabla from "../../../../components/tablas/FiltrosTabla";
import PaginacionTabla from "../../../../components/tablas/PaginacionTabla";
import AccionesTabla from "../../../../components/tablas/AccionesTabla";

import ModalEditarFamiliar from "./ModalEditarFamiliar";
import ModalCrearFamiliar from "./ModalCrearFamiliar";

import { useFamiliaTabla } from "../../hooks/useFamiliaTabla";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { usePermissions } from "../../../../context/PermissionsContext";

export default function ComposicionFamiliar({
  familia = [],
  expedienteId,
  postulanteId,
  puedeEditar = true,
}) {

  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEdit = hasModulePermission("familia", "editar");
  const canCreate = hasModulePermission("familia", "eliminar");
  const canDelete = hasModulePermission("familia", "crear");

  const puedeCrear = canCreate && puedeEditar;
  const puedeModificar = canEdit && puedeEditar;
  const puedeEliminar = canDelete && puedeEditar;

  const [confirmarEliminar, setConfirmarEliminar] =
    useState({
      open: false,
      data: null,
    });

  const [resultadoModal, setResultadoModal] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

  const {
    modalCrearOpen,
    setModalCrearOpen,

    modalEditarOpen,
    setModalEditarOpen,

    familiarEnEdicion,
    setFamiliarEnEdicion,

    search,
    setSearch,

    currentPage,
    setCurrentPage,

    paginatedData,
    totalPages,
    totalItems,
    pageSize,

    loadingEliminar,
    loadingEditar,

    abrirCrear,
    abrirEditar,

    handleEliminar,
    handleCreated,
    handleSaveEditar,

  } = useFamiliaTabla(
    familia,
    expedienteId,
    postulanteId,
  );

  const preHandleEliminar = (familiar) => {
    setConfirmarEliminar({
      open: true,
      data: familiar,
    });
  };

  const ejecutarEliminacion = async () => {

    try {

      await handleEliminar(
        confirmarEliminar.data,
      );

      setConfirmarEliminar({
        open: false,
        data: null,
      });

      setResultadoModal({
        open: true,
        type: "success",
        title: "Eliminado con éxito",
        message:
          "El miembro de la familia ha sido removido del expediente.",
      });

    } catch (error) {

      setResultadoModal({
        open: true,
        type: "error",
        title: "Error al eliminar",
        message:
          error.message ||
          "No se pudo eliminar al integrante.",
      });
    }
  };

  const columns = [
    {
      key: "nombre",
      label: "Nombre",
    },

    {
      key: "parentesco",
      label: "Parentesco",
    },

    {
      key: "telefono",
      label: "Teléfono",
    },

    {
      key: "actividad",
      label: "Ocupación / Área",
    },

    {
      key: "salario",
      label: "Salario o Escuela",
    },

    {
      key: "vive",
      label: "Vive en casa",
    },

    {
      key: "tutor",
      label: "Tutor",
    },

    {
      key: "acciones",
      label: "Acciones",
    },
  ];

  const renderCell = (row, key) => {

    switch (key) {

      case "nombre": {
        const calcularEdad = (fechaNacimiento) => {
          if (!fechaNacimiento) return "";

          const hoy = new Date();
          const nacimiento = new Date(fechaNacimiento);

          let edad = hoy.getFullYear() - nacimiento.getFullYear();

          const mes = hoy.getMonth() - nacimiento.getMonth();

          if (
            mes < 0 ||
            (mes === 0 &&
              hoy.getDate() < nacimiento.getDate())
          ) {
            edad--;
          }

          return edad;
        };

        return (
          <div>
            <div className="font-semibold text-slate-800 uppercase text-xs">
              {row.nombre} {row.apellido_p} {row.apellido_m}
            </div>

            <div className="text-xs text-slate-500">
              {calcularEdad(row.fecha_nacimiento)} años
            </div>
          </div>
        );
      }

      case "parentesco":
        return row.parentesco;

      case "telefono":
        return row.telefono;

      case "actividad":
        return (
          <div>

            <div className="text-slate-700 font-medium">
              {row.actividad_principal}
            </div>

            <div className="text-[11px] text-slate-400 italic">
              {row.area_laboral_escuela}
            </div>
          </div>
        );

      case "salario":
        return row.salario;

      case "vive":
        return row.vive_en_casa ? (
          <Check
            className="text-green-600 mx-auto"
            size={18}
          />
        ) : (
          <X
            className="text-red-500 mx-auto"
            size={18}
          />
        );

      case "tutor":
        return row.es_tutor_principal ? (
          <Check
            className="text-green-600 mx-auto"
            size={18}
          />
        ) : (
          <X
            className="text-red-500 mx-auto"
            size={18}
          />
        );

      case "acciones": {

        const esTutor =
          row.es_tutor_principal;

        return (
  <AccionesTabla
    row={row}
    actions={[
      ...(canEdit && puedeEditar
        ? [
            {
              label: "Editar",

              icon: <Pencil size={18} />,

              onClick: abrirEditar,

              className:
                "p-2 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-500 hover:text-teal-600 transition",
            },
          ]
        : []),

      ...(!esTutor && canDelete && puedeEditar
        ? [
            {
              label: "Eliminar",

              icon: <Trash2 size={18} />,

              onClick: preHandleEliminar,

              className:
                "p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition",
            },
          ]
        : []),
    ]}
  />
);
      }

      default:
        return row[key];
    }
  };

  return (
    <div className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden mt-6">

      {/* header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-50">

        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">

          <div className="p-2 bg-teal-50 rounded-lg">
            <Users
              size={20}
              className="text-teal-600"
            />
          </div>

          Composición Familiar
        </h3>
        {puedeCrear && (
          <BotonInterno
            icon={<Plus size={18} />}
            onClick={abrirCrear}
          >
            Agregar Miembro
          </BotonInterno>
        )}
      </div>

      {/* filtros */}
      <FiltrosTabla
        searchValue={search}

        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}

        onClearFilters={() => {
          setSearch("");
          setCurrentPage(1);
        }}
      />

      {/* tabla */}
      <DatosTabla
        columns={columns}
        data={paginatedData}
        renderCell={renderCell}
        rowKey="id_familia"
      />

      {/* paginacion */}
      <PaginacionTabla
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* crear */}
      <ModalCrearFamiliar
        open={modalCrearOpen}
        onClose={() =>
          setModalCrearOpen(false)
        }
        onCreated={handleCreated}
        expedienteId={expedienteId}
        postulanteId={postulanteId}
      />

      {/* editar */}
      <ModalEditarFamiliar
        open={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
        loading={loadingEditar}
        editando={familiarEnEdicion}
        setEditando={setFamiliarEnEdicion}
      />

      {/* confirmar eliminar */}
      <ModalConfirmacion
        open={confirmarEliminar.open}
        title="¿Eliminar miembro familiar?"
        description={`¿Estás seguro de que deseas eliminar a ${confirmarEliminar.data?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar integrante"
        color="red"
        loading={loadingEliminar}
        onClose={() =>
          setConfirmarEliminar({
            open: false,
            data: null,
          })
        }
        onConfirm={ejecutarEliminacion}
      />

      {/* resultado */}
      <ModalResultado
        open={resultadoModal.open}
        type={resultadoModal.type}
        title={resultadoModal.title}
        message={resultadoModal.message}
        onClose={() =>
          setResultadoModal({
            ...resultadoModal,
            open: false,
          })
        }
      />
    </div>
  );
}