import { useState, useRef } from "react";
import { UserPlus } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PostulanteCrearModal from "../../components/postulantes/modales/PostulanteCrearModal";
import { usePostulantesPage } from "../../hooks/postulantes/usePostulantesPage";
import PeriodoTabla from "../../components/postulantes/tabla/PostulanteTabla";
import PostulanteFiltros from "../../components/postulantes/tabla/PostulanteFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import { FormatoImpresion } from "../../components/postulantes/FormatoSocioeconomico";
import { flushSync } from "react-dom";


export default function PostulantesPagina() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postulanteAImprimir, setPostulanteAImprimir] = useState(null);
  const componenteRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Estudio_${postulanteAImprimir?.id_expediente?.nombre || 'Postulante'}`,
  });
  const ejecutarImpresion = (postulante) => {
    flushSync(() => {
      setPostulanteAImprimir(postulante);
    });

    setTimeout(() => {
      console.time("print_total");
      handlePrint();
      console.timeEnd("print_total");
    }, 100);
  };

  const {
    filters,
    postulantes,
    totalCount,
    loading,
    fetchPostulantes,
    search,
    handleSearchChange,
    handleClearFilters,
    handleFilterChange,
    currentPage,
    totalPages,
    setCurrentPage,
    PAGE_SIZE
  } = usePostulantesPage();

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Nuevos Ingresos"
        descripcion="Monitoreo y organización de posibles nuevos beneficiarios"
        accion={
          <Boton
            icon={<UserPlus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Ingreso
          </Boton>
        }
      />

      <div className="rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] relative">
        {/* Filtros */}
        <PostulanteFiltros
          search={search}
          filters={filters} // Nuevo
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange} // Nuevo
          onClearFilters={handleClearFilters}
        />
        {/* Tabla con estado de carga */}
        <div className="h-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          ) : (
            <PeriodoTabla postulantes={postulantes} onRefresh={fetchPostulantes} onPrint={ejecutarImpresion} />
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
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div ref={componenteRef}>
          <FormatoImpresion postulante={postulanteAImprimir} />
        </div>
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