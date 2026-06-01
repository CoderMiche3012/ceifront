import { useState, useEffect, } from "react";
import { UserPlus, UserCheck, UserX, Building2, HeartHandshake, HandHeart, } from "lucide-react";
import { useLocation, useNavigate, } from "react-router-dom";

import { ui } from "../../styles/ui/uiClasses";
import TarjetasEstadisticas from "../../components/shared/TarjetasEstadisticas";

import Boton from "../../components/ui/Boton";
import Alerta from "../../components/ui/AlertaError";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import DonadorFiltros from "../../features/donadores/components/tabla/DonadorFiltros";
import DonadoresTabla from "../../features/donadores/components/tabla/DonadorTabla";

import DonadorCrearModal from "../../features/donadores/components/modales/DonadorCrearModal";
import EditarDatosGenerales from "../../features/donadores/components/modales/EditarDatosGenerales";

import { useDonadoresPage } from "../../features/donadores/hooks/useDonadoresPage";
import { usePermissions } from "../../context/PermissionsContext";

export default function DonadoresPagina() {
  // estados locales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [donadorSeleccionado, setDonadorSeleccionado,] = useState(null);
  //para permisos
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canCreate = hasModulePermission("donadores", "crear");
  
  const {
    filters,
    donadores,
    totalCount,
    loading,
    error,
    search,
    handleSearchChange,
    handleClearFilters,
    handleFilterChange,
    currentPage,
    totalPages,
    setCurrentPage,
    PAGE_SIZE,
  } = useDonadoresPage();

  const location = useLocation();
  const navigate = useNavigate();
  // redireccion al detalle del donador
  useEffect(() => {
    if (location.state?.openModal) {
      setIsModalOpen(true);
      navigate(
        location.pathname,
        {
          replace: true,
          state: {},
        }
      );
    }
  }, [location, navigate,]);

  const handleEditar =
    (donador) => {
      setDonadorSeleccionado(donador);
      setModalEditar(true);
    };
  // metricas
  const activos = donadores.filter((d) => d.estatus?.toLowerCase() === "activo").length;
  const inactivos = donadores.filter((d) => d.estatus?.toLowerCase() === "inactivo").length;
  const cei = donadores.filter((d) => d.tipo === "CEI").length;
  const canfro = donadores.filter((d) => d.tipo === "CANFRO").length;
  const oye = donadores.filter((d) => d.tipo === "OYE").length;
  
  return (
    <section className={ui.page}>
      <EncabezadoPagina
        titulo="Gestión de Donadores"
        descripcion="Monitorea y organiza los donadores"
        accion={
          !isPermsLoading &&
          canCreate && (
            <Boton
              size="md"
              onClick={() => setIsModalOpen(true)}
              icon={<UserPlus size={18} />}
            >
              Registrar Donador
            </Boton>
          )
        }
      />

      {error && (
        <Alerta
          mensaje={error.message}
          tipo="error"
        />
      )}

      {/* resumen */}
      <TarjetasEstadisticas
        items={[
          {
            label: "Activos",
            value: activos,
            icon: UserCheck,
            color: "green",
          },
          {
            label: "Inactivos",
            value: inactivos,
            icon: UserX,
            color: "red",
          },
          {
            label: "CEI",
            value: cei,
            icon: Building2,
            color: "blue",
          },
          {
            label: "CANFRO",
            value: canfro,
            icon: HeartHandshake,
            color: "purple",
          },
          {
            label: "OYE",
            value: oye,
            icon: HandHeart,
            color: "orange",
          },
        ]}
      />

      <div className={ui.card}>
        <DonadorFiltros
          search={search}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <DonadoresTabla
          donadores={donadores}
          isLoading={loading}
          onEditar={handleEditar}
        />

        {!loading && !error && totalCount > 0 && (
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
        onClose={() => setIsModalOpen(false) }
      />

      <EditarDatosGenerales
        open={ modalEditar }
        donador={ donadorSeleccionado }
        onClose={() => setModalEditar( false ) }
        onSuccess={() => setModalEditar( false )
        }
      />
    </section>
  );
}