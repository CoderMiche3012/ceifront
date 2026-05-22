import PeriodoEditarModal from "./PeriodoEditarModal";
import PeriodoCrearModal from "./PeriodoCrearModal";

// contenedor central que maneja todos los modales de periodo
export default function PeriodoModal({
  selectedPeriodo,filteredPeriodos,
  isCreateModalOpen,onCloseCreateModal,onPeriodoCreated,//para el modal de crear
  isEditModalOpen, onCloseEditModal,onPeriodoUpdated,//para el modal de editar
}) {
  return (
    <>
      <PeriodoEditarModal
        open={isEditModalOpen}
        periodo={selectedPeriodo}
        onClose={onCloseEditModal}
        onSuccess={onPeriodoUpdated}
      />
      <PeriodoCrearModal
        open={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onSuccess={onPeriodoCreated}
        periodos={filteredPeriodos}
      />
    </>
  );
}