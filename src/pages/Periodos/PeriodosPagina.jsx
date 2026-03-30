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

export default function PeriodosPagina() {
  const {
    periodos, loading, error, fetchPeriodos,//para tablas y errores
    search, handleSearchChange, handleClearFilters, //para el buscador
    currentPage, totalPages, filteredPeriodos, PAGE_SIZE, setCurrentPage, //para la paginacion
    //estados de los modales
    isCreateModalOpen, isEditModalOpen, selectedPeriodo,
    handleOpenCreate, handleCloseCreate, handleOpenEdit, handleCloseEdit
  } = usePeriodosPage();
  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Cliclos Escolares"
        descripcion="Monitorea y organiza los ciclos escolares"
        accion={
          <Boton onClick={handleOpenCreate} icon={<CalendarPlus size={18} />}>
            Registrar Ciclo
          </Boton>
        }
      />
      <PeriodoActivo onEdit={handleOpenEdit} />
      {/* en caso de error */}
      <Alerta mensaje={error} tipo="error" />
      {/**parte de la tabla*/}
      <div className="overflow-hidden rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <PeriodoFiltros
          search={search}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />
        <PeriodoTabla periodos={periodos} />
        {/* paginacion */}
        {!loading && !error && (
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
        onPeriodoCreated={fetchPeriodos} //refresca la tabla tras crear
        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={handleCloseEdit}
        onPeriodoUpdated={fetchPeriodos} //refresca la tabla tras editar
      />
    </section>
  );
}