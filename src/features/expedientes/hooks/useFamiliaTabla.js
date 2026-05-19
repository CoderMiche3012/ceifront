import { useState } from "react";
import { crearFamilia, actualizarFamilia, eliminarFamilia } from "../services/familiaService";
import { formatErrorAnidado } from "../../../utils/errorHandlers";
import { useQueryClient } from "@tanstack/react-query";

const getErrorMessage = (err) => {

    if (err?.response?.data) {
        return formatErrorAnidado(err.response.data);
    }

    if (err?.message) {
        return formatErrorAnidado(err);
    }

    return "Error inesperado";
};



export const useFamiliaTabla = (familia) => {
    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [familiarEnEdicion, setFamiliarEnEdicion] = useState(null);
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const abrirCrear = () => setModalCrearOpen(true);

    const abrirEditar = (familiar) => {
        setFamiliarEnEdicion({
            ...familiar,
            vive_en_casa:
                familiar.vive_en_casa === true ? "true" :
                    familiar.vive_en_casa === false ? "false" : "",
        });
        setModalEditarOpen(true);
    };

    const handleEliminar = async (row) => {
        try {
            const id = row.id_familia || row.id;

    await eliminarFamilia(id);

    queryClient.invalidateQueries({ queryKey: ["expediente"] });
        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    };

    const handleCreated = async (nuevo) => {
    await crearFamilia(nuevo); // si lo haces aquí
    queryClient.invalidateQueries({ queryKey: ["expediente", nuevo.expedienteId] });
};
    const handleSaveEditar = async (dataFinal) => {
        try {
            const id = dataFinal.id_familia || dataFinal.id;

            await actualizarFamilia(id, dataFinal);

            queryClient.invalidateQueries({ queryKey: ["expediente"] });
        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    };

    const filteredData = familia.filter((f) =>
        `${f.nombre} ${f.apellido_p} ${f.apellido_m} ${f.parentesco} ${f.telefono}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return {
        // Modales
        modalCrearOpen, setModalCrearOpen,
        modalEditarOpen, setModalEditarOpen,
        familiarEnEdicion, setFamiliarEnEdicion,
        // Tabla
        search, setSearch,
        currentPage, setCurrentPage,
        paginatedData, totalPages, totalItems: filteredData.length,
        pageSize,
        // Acciones
        abrirCrear, abrirEditar, handleEliminar, handleCreated, handleSaveEditar
    };
};