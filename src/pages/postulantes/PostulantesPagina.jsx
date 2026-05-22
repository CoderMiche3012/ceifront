import { useState, useRef, useEffect, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PostulanteCrearModal from "../../features/postulantes/components/modales/PostulanteCrearModal";
import { usePostulantesPage } from "../../features/postulantes/hooks/usePostulantesPage";
import PostulanteTabla from "../../features/postulantes/components/tabla/PostulanteTabla";
import PostulanteFiltros from "../../features/postulantes/components/tabla/PostulanteFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import { FormatoImpresion } from "../../features/postulantes/components/FormatoSocioeconomico";
import { usePermissions } from "../../context/PermissionsContext";
import { hasPermission } from "../../utils/menuPermissions";
import { useLocation, useNavigate } from "react-router-dom";

export default function PostulantesPagina() {
  const { permissions } = usePermissions();
    const canCreate = useMemo(
        () => hasPermission(permissions, "Crear Postulantes"),
        [permissions]
    );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postulanteAImprimir, setPostulanteAImprimir] = useState(null);
  const componenteRef = useRef(null);
  const nombreArchivo = postulanteAImprimir?.id_expediente?.nombre?.replace(/\s+/g, "_")?.replace(/[^\w-]/g, "") || "Postulante";
  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Estudio_${nombreArchivo}`,
    //limpia el estado para que el componente se desmonte tras imprimir
    onAfterPrint: () => {
      setPostulanteAImprimir(null);
    },
    onPrintError: (error) => {
      console.error("Error al imprimir:", error);
      setPostulanteAImprimir(null);
    },
  })
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.openModal) {
      setIsModalOpen(true);

      // Limpiamos el estado del historial para que no se reabra al actualizar la página
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  useEffect(() => {
    if (postulanteAImprimir && componenteRef.current) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [postulanteAImprimir, handlePrint]);
  const ejecutarImpresion = (postulante) => {
    if (!postulante) return;
    setPostulanteAImprimir(postulante);
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
          canCreate && (
          <Boton
            icon={<UserPlus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Ingreso
          </Boton>
          )
        }
      />

      <div className="rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] relative">
        {/* Filtros */}
        <PostulanteFiltros
          search={search}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        {/* Tabla con estado de carga */}
        <div className="h-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          ) : (
            <PostulanteTabla postulantes={postulantes} onRefresh={fetchPostulantes} onPrint={ejecutarImpresion} />
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
      {postulanteAImprimir && (
        <div style={{ display: "none" }}>
          <div ref={componenteRef}>
            {postulanteAImprimir && (
              <FormatoImpresion postulante={postulanteAImprimir} />
            )}
          </div>
        </div>
      )}

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