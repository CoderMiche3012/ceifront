import { CalendarPlus } from "lucide-react";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PeriodoTabla from "../../components/periodos/tabla/PeriodoTabla";
import Alerta from "../../components/ui/AlertaError";
import PeriodoFiltros from "../../components/periodos/tabla/PeriodoFiltros";
import usePeriodosPage from "../../hooks/usePeriodosPage";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import PeriodoModal from "../../components/periodos/modales/PeriodoModal";
import PeriodoActivo from "../../components/periodos/PeriodoActivo";
import { hasPermission } from "../../utils/menuPermissions";
import { usePermissions } from "../../context/PermissionsContext";
import { useMemo } from "react";

export default function PeriodosPagina() {
  const { permissions, loading: isPermsLoading } = usePermissions();  

  const {
    periodoActivo,periodos, loading, error, fetchPeriodos,
    search, handleSearchChange, handleClearFilters,
    currentPage, totalPages, filteredPeriodos, PAGE_SIZE, setCurrentPage,
    isCreateModalOpen, isEditModalOpen, selectedPeriodo,
    handleOpenCreate, handleCloseCreate, handleOpenEdit, handleCloseEdit
  } = usePeriodosPage();

  const canCreate = useMemo(() => 
    hasPermission(permissions, "Crear Periodos"), 
  [permissions]);

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Periodos" 
        descripcion="Monitorea y organiza los periodos escolares"
        accion={
          !isPermsLoading && canCreate && ( 
            <Boton onClick={handleOpenCreate} icon={<CalendarPlus size={18} />}>
              Registrar Periodo
            </Boton>
          )
        }
      />

      <PeriodoActivo periodoActivo={periodoActivo} onEdit={handleOpenEdit} />

      {/* Solo mostrar alerta si realmente hay un error de datos */}
      {error && <Alerta mensaje={error} tipo="error" />}

      <div className="overflow-hidden rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <PeriodoFiltros
          search={search}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />
        
        <PeriodoTabla 
          periodos={periodos} 
          isLoading={loading} 
        />

        {!loading && !error && filteredPeriodos.length > 0 && (
          <PaginacionTabla
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPeriodos.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <PeriodoModal
        selectedPeriodo={selectedPeriodo}
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={handleCloseCreate}
        onPeriodoCreated={fetchPeriodos}
        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={handleCloseEdit}
        onPeriodoUpdated={fetchPeriodos}
      />
    </section>
  );
}