import { UserPlus } from "lucide-react";
import { useState, useRef } from "react";
import Boton from "../../components/ui/Boton";
import { useDonadoresPage } from "../../hooks/donadores/useDonadoresPage";
import DonadorFiltros from "../../components/donadores/tabla/DonadorFiltros";
import DonadoresTabla from "../../components/donadores/tabla/DonadorTabla";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import DonadorCrearModal from "../../components/donadores/modales/DonadorCrearModal";
import EditarDatosGenerales from "../../components/donadores/modales/EditarDatosGenerales";

export default function DonadoresPagina() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [donadorSeleccionado, setDonadorSeleccionado] = useState(null);
    const {
        filters,
        donadores,
        totalCount,
        loading,
        fetchDonadores,
        search,
        handleSearchChange,
        handleClearFilters,
        handleFilterChange,
        currentPage,
        totalPages,
        setCurrentPage,
        PAGE_SIZE
    } = useDonadoresPage();
    const handleEditar = (donador) => {
        setDonadorSeleccionado(donador);
        setModalEditar(true);
    };
    return (
        <section className="space-y-6">
            <EncabezadoPagina
                titulo="Gestión de Donadores"
                descripcion="Monitoreo y organizacion de donadores"
                accion={
                    <Boton
                        icon={<UserPlus size={18} />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Registrar Donador
                    </Boton>
                }
            />
            <div className="rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] relative">
                <DonadorFiltros
                    search={search}
                    filters={filters}
                    onSearchChange={handleSearchChange}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
                <div className="h-auto">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                        </div>
                    ) : (
                        <DonadoresTabla donadores={donadores} onEditar={handleEditar} onRefresh={fetchDonadores} />
                    )}
                </div>

                {!loading && (
                    <PaginacionTabla
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
            <DonadorCrearModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchDonadores();
                }}
            />
            {modalEditar && (
                <EditarDatosGenerales
                    open={modalEditar}
                    donador={donadorSeleccionado}
                    onClose={() => setModalEditar(false)}
                    onSuccess={() => {
                        setModalEditar(false);
                        fetchDonadores();
                    }}
                />
            )}
        </section>
    );
}
