import { UserPlus } from "lucide-react";
import { useState, useRef } from "react";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import BeneficiarioCrearModal from "../../components/beneficiarios/modales/BeneficiarioCrearModal";
import BeneficiarioTabla from "../../components/beneficiarios/tabla/BeneficiarioTabla";
import BeneficiarioFiltros from "../../components/beneficiarios/tabla/BeneficiarioFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import { useBeneficiariosPage } from "../../hooks/beneficiarios/useBeneficiariosPage";

export default function BeneficiariosPagina() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
      filters,
      beneficiarios,
      totalCount,
      loading,
      fetchBeneficiarios,
      search,
      handleSearchChange,
      handleClearFilters,
      handleFilterChange,
      currentPage,
      totalPages,
      setCurrentPage,
      PAGE_SIZE
    } = useBeneficiariosPage();
    

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Beneficiarios"
        descripcion="Monitoreo y organizacion de expedientes"
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
          onFilterChange={handleFilterChange} 
          onClearFilters={handleClearFilters}
        />
        <div className="h-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          ) : (
            <BeneficiarioTabla beneficiarios={beneficiarios} onRefresh={fetchBeneficiarios} />
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
      <BeneficiarioCrearModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchBeneficiarios();
        }}
      />
    </section>
  );
}
