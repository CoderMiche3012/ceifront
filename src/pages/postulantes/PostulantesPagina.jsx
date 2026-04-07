import { useState } from "react";
import { UserPlus } from "lucide-react";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PostulanteCrearModal from "../../components/postulantes/modales/PostulanteCrearModal"; // Ajusta la ruta
import { usePostulantesPage } from "../../hooks/postulantes/usePostulantesPage"; // Ajusta la ruta
import PeriodoTabla from "../../components/postulantes/tabla/PostulanteTabla";
import PostulanteFiltros from "../../components/postulantes/tabla/PostulanteFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";


export default function PostulantesPagina() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    postulantes,
    totalCount,
    loading,
    fetchPostulantes,
    search,
    handleSearchChange,
    handleClearFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    PAGE_SIZE
  } = usePostulantesPage();

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Postulantes"
        descripcion="Monitoreo y organización de postulantes"
        accion={
          <Boton
            icon={<UserPlus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Postulante
          </Boton>
        }
      />

      <div className="overflow-hidden rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        {/* Filtros */}
        <PostulanteFiltros
          search={search}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />

        {/* Tabla con estado de carga */}
        <div className="h-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          ) : (
            <PeriodoTabla postulantes={postulantes} onRefresh={fetchPostulantes} />
          )}
        </div>

        {/* Paginación */}
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

      <PostulanteCrearModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchPostulantes();
          setIsModalOpen(false);
        }}
      />
    </section>
  );
}