import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import Boton from "../../components/ui/Boton";
import { useLocation, useNavigate } from "react-router-dom";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import BeneficiarioCrearModal from "../../features/beneficiarios/components/modales/BeneficiarioCrearModal";
import BeneficiarioTabla from "../../features/beneficiarios/components/tabla/BeneficiarioTabla";
import BeneficiarioFiltros from "../../features/beneficiarios/components/tabla/BeneficiarioFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import { useBeneficiariosPage } from "../../features/beneficiarios/hooks/useBeneficiariosPage";
import { usePermissions } from "../../context/PermissionsContext";

export default function BeneficiariosPagina() {
 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const {hasModulePermission,loading: isPermsLoading,} = usePermissions();
  const canCreate = hasModulePermission("beneficiarios", "crear");
  const {
    filters,
    beneficiarios,
    totalCount,
    loading,
    search,
    handleSearchChange,
    handleClearFilters,
    handleFilterChange,
    currentPage,
    totalPages,
    setCurrentPage,
    PAGE_SIZE,
    periodosDisponibles,
    periodo,
  } = useBeneficiariosPage();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openModal) {
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Beneficiarios"
        descripcion="Monitoreo y organización de beneficiarios"
        accion={
          !isPermsLoading && canCreate && (
            <Boton
              icon={<UserPlus size={18} />}
              onClick={() => setIsModalOpen(true)}
            >
              Registrar Beneficiario
            </Boton>
          )
        }
      />

      <div className="rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] relative">
        {/* Componente de Filtros y Búsqueda */}
        <BeneficiarioFiltros
          search={search}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          periodos={periodosDisponibles}
          periodo={periodo}
        />

        {/* Tabla de registros filtrados */}
        <BeneficiarioTabla 
          beneficiarios={beneficiarios} 
          periodo={periodo} 
        />
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 absolute inset-0 bg-white/70 rounded-[24px] z-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <span className="text-sm font-medium text-slate-500">Cargando beneficiarios...</span>
          </div>
        )}
        {/* Paginación de la tabla */}
        {!loading && totalPages >= 1 && (
          <PaginacionTabla
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      {/* Modal para inserción de nuevos beneficiarios */}
      <BeneficiarioCrearModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </section>
  );
}