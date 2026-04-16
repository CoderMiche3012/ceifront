import { useState } from "react";
import { actualizarFamilia, eliminarFamilia } from "../../services/familiaService";

export const useFamiliaTabla = (familia, onUpdate) => {
    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [familiarEnEdicion, setFamiliarEnEdicion] = useState(null);

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
            const nuevaLista = familia.filter((f) => (f.id_familia || f.id) !== id);
            onUpdate(nuevaLista);
        } catch (error) {
            console.error("Error al eliminar:", error.message);
        }
    };

    const handleCreated = (nuevo) => {
        onUpdate([...familia, nuevo]);
    };

    const handleSaveEditar = async (dataFinal) => {
        try {
            const id = dataFinal.id_familia || dataFinal.id;
            const res = await actualizarFamilia(id, dataFinal);
            const nuevaLista = familia.map((f) =>
                (f.id_familia === id || f.id === id) ? res : f
            );
            onUpdate(nuevaLista);
            setModalEditarOpen(false);
        } catch (error) {
            throw error; 
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