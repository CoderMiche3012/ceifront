import { useState } from "react";

import {
  useActualizarFamilia,
  useEliminarFamilia,
  useCrearFamilia,
} from "./useFamilia";

import { useQueryClient } from "@tanstack/react-query";
import { postulantesKeys } from "../../../features/postulantes/services/postulantesKeys";

import { formatErrorAnidado } from "../../../utils/errorHandlers";

const getErrorMessage = (err) => {
  if (err?.response?.data) {
    return formatErrorAnidado(err.response.data);
  }

  if (err?.message) {
    return formatErrorAnidado(err);
  }

  return "Error inesperado";
};

export const useFamiliaTabla = (
  familia = [],
  expedienteId,
  postulanteId
) => {
  const queryClient = useQueryClient();

  // -------------------------
  // UI STATE
  // -------------------------
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  const [familiarEnEdicion, setFamiliarEnEdicion] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // -------------------------
  // MUTATIONS
  // -------------------------
  const crearMutation = useCrearFamilia(expedienteId);
  const actualizarMutation = useActualizarFamilia(expedienteId);
  const eliminarMutation = useEliminarFamilia(expedienteId);

  // -------------------------
  // MODALES
  // -------------------------
  const abrirCrear = () => setModalCrearOpen(true);

  const abrirEditar = (familiar) => {
    setFamiliarEnEdicion({
      ...familiar,
      vive_en_casa:
        familiar.vive_en_casa === true
          ? "true"
          : familiar.vive_en_casa === false
          ? "false"
          : "",
    });

    setModalEditarOpen(true);
  };

  // -------------------------
  // CREATE
  // -------------------------
  const handleCreated = async () => {
    setModalCrearOpen(false);

    await queryClient.invalidateQueries({
      queryKey: postulantesKeys.detail(postulanteId),
    });
  };

  // -------------------------
  // UPDATE
  // -------------------------
  const handleSaveEditar = async (dataFinal) => {
    try {
      await actualizarMutation.mutateAsync({
        id: dataFinal.id_familia,
        data: dataFinal,
      });

      await queryClient.invalidateQueries({
        queryKey: postulantesKeys.detail(postulanteId),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  // -------------------------
  // DELETE
  // -------------------------
  const handleEliminar = async (row) => {
    try {
      await eliminarMutation.mutateAsync(row.id_familia);

      await queryClient.invalidateQueries({
        queryKey: postulantesKeys.detail(postulanteId),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  // -------------------------
  // FILTER + SEARCH
  // -------------------------
  const filteredData = familia.filter((f) =>
    `
      ${f.nombre}
      ${f.apellido_p}
      ${f.apellido_m}
      ${f.parentesco}
      ${f.telefono}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // -------------------------
  // PAGINATION
  // -------------------------
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // -------------------------
  // RETURN
  // -------------------------
  return {
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
    totalItems: filteredData.length,
    pageSize,

    loadingEliminar: eliminarMutation.isPending,
    loadingEditar: actualizarMutation.isPending,

    abrirCrear,
    abrirEditar,

    handleEliminar,
    handleCreated,
    handleSaveEditar,
  };
};