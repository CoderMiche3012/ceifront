import { UserPlus } from "lucide-react";
import { useState } from "react";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import BeneficiarioCrearModal from "../../components/beneficiarios/modales/BeneficiarioCrearModal";
import BeneficiarioTabla from "../../components/beneficiarios/tabla/BeneficiarioTabla";
import BeneficiarioFiltros from "../../components/beneficiarios/tabla/BeneficiarioFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import { useBeneficiariosPage } from "../../hooks/beneficiarios/useBeneficiariosPage";
import { useQueryClient } from "@tanstack/react-query";

export default function BeneficiariosPagina() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
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
    refetch,
    periodosDisponibles,
    periodo,
    setPeriodo
  } = useBeneficiariosPage();

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["beneficiarios"] });
    setCurrentPage(1);
  };

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Beneficiarios"
        descripcion="Monitoreo y organizacion de beneficiarios"
        accion={
          <Boton
            icon={<UserPlus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Beneficiario
          </Boton>
        }
      />
      <div className="rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] relative">
        <BeneficiarioFiltros
          search={search}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={(key, value) => {
            if (key === "periodo") {
              setPeriodo(value);
            } else {
              handleFilterChange(key, value);
            }
          }}
          onClearFilters={handleClearFilters}
          periodos={periodosDisponibles}
          periodo={periodo}
        />
        <BeneficiarioTabla beneficiarios={beneficiarios} onRefresh={refetch} periodo={periodo} />
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <span className="text-sm text-slate-500">Cargando beneficiarios...</span>
          </div>
        )}
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
      <BeneficiarioCrearModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </section>
  );
}
