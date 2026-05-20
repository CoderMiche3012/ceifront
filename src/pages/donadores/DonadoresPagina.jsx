import { useState, useRef , useEffect} from "react";
import Boton from "../../components/ui/Boton";
import { useDonadoresPage } from "../../features/donadores/hooks/useDonadoresPage";
import DonadorFiltros from "../../features/donadores/components/tabla/DonadorFiltros";
import DonadoresTabla from "../../features/donadores/components/tabla/DonadorTabla";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import DonadorCrearModal from "../../features/donadores/components/modales/DonadorCrearModal";
import EditarDatosGenerales from "../../features/donadores/components/modales/EditarDatosGenerales";
import { UserPlus, Users, UserCheck, UserX, Building2, HeartHandshake, HandHeart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.openModal) {
      setIsModalOpen(true);

      // Limpiamos el estado del historial para que no se reabra al actualizar la página
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

    const handleEditar = (donador) => {
        setDonadorSeleccionado(donador);
        setModalEditar(true);
    };
    const activos = donadores.filter(d => d.estatus?.toLowerCase() === "activo").length;
    const inactivos = donadores.filter(d => d.estatus?.toLowerCase() === "inactivo").length;
    const cei = donadores.filter(d => d.tipo === "CEI").length;
    const canfro = donadores.filter(d => d.tipo === "CANFRO").length;
    const oye = donadores.filter(d => d.tipo === "OYE").length;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Activos */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Activos</p>
                        <h3 className="text-2xl font-bold text-green-600">{activos}</h3>
                    </div>
                    <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                        <UserCheck size={22} />
                    </div>
                </div>

                {/* Inactivos */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Inactivos</p>
                        <h3 className="text-2xl font-bold text-red-600">{inactivos}</h3>
                    </div>
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                        <UserX size={22} />
                    </div>
                </div>

                {/* CEI */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">CEI</p>
                        <h3 className="text-2xl font-bold text-blue-600">{cei}</h3>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                        <Building2 size={22} />
                    </div>
                </div>

                {/* CANFRO */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">CANFRO</p>
                        <h3 className="text-2xl font-bold text-purple-600">{canfro}</h3>
                    </div>
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                        <HeartHandshake size={22} />
                    </div>
                </div>

                {/* OYE */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">OYE</p>
                        <h3 className="text-2xl font-bold text-orange-600">{oye}</h3>
                    </div>
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                        <HandHeart size={22} />
                    </div>
                </div>

            </div>
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
