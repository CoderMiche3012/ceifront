import React, { useState, useMemo, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import EncabezadoPagina from "../components/shared/EncabezadoPagina";
import PaginacionTabla from "../components/tablas/PaginacionTabla";
import { useAsistenciaData } from "../features/asistencias/hooks/useAsistencias";
import AsistenciasFiltros from "../features/asistencias/components/AsistenciaFiltros";
import AsistenciasTabla from "../features/asistencias/components/AsistenciaTabla";
import { usePeriodoActivo } from "../features/periodos/hooks/usePeriodos";
import { generarSemanasLaborales } from "../utils/dateHelpers";
import ModalResultado from "../components/shared/ModalResultado";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";
import { usePermissions } from "../context/PermissionsContext";
import kidsAnimation from "../assets/imagenes/kid.json";
import Lottie from "lottie-react";

const AsistenciasPagina = () => {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canCreate = hasModulePermission("servicios", "crear");
  const canEdit = hasModulePermission("servicios", "editar");
  const puedeEditar = canCreate && canEdit

  const [pagina, setPagina] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const { data: periodoActivo = null, isLoading: loadingActivo, error: errorActivo } = usePeriodoActivo();
  const periodoId = periodoActivo?.id_periodo;
  const [cambios, setCambios] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const statsCambios = useMemo(() => {
    const lista = Object.values(cambios);
    const creados = lista.filter(c => !c.id_asistencia_servicio).length;
    const editados = lista.filter(c => c.id_asistencia_servicio).length;
    return { creados, editados, total: lista.length };
  }, [cambios]);

  const mensajeConfirmacion = useMemo(() => {
    const parts = [];
    if (statsCambios.creados > 0) parts.push(`agregar ${statsCambios.creados} nuevas asistencias`);
    if (statsCambios.editados > 0) parts.push(`modificar ${statsCambios.editados} asistencias existentes`);

    return `¿Estás seguro de que deseas ${parts.join(" y ")}?`;
  }, [statsCambios]);

  const onGuardarClick = () => setShowConfirm(true);

  const { data, isLoading, isError, mutation } =useAsistenciaData(periodoId);

  const confirmarGuardado = async () => {
    const listaCambios = Object.values(cambios);

    if (!listaCambios.length) return;

    setShowConfirm(false);

    try {
      await mutation.guardarAsistencias(listaCambios);
      setCambios({}); 
      setShowResult(true);
    } catch (err) {
    }
  };
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    servicio: "comedor",
  });

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState(null);

  const limitesFecha = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0];

    return {
      min: null, 
      max: hoy,  
    };
  }, []);
  const onFechaChangeSafe = (fecha) => {
    const hoy = new Date().toISOString().split("T")[0];

    if (fecha > hoy) return;

    setFechaSeleccionada(fecha);
  };
  const semanas = useMemo(() => {
    const inicio = periodoActivo?.fecha_inicio;
    const fin = periodoActivo?.fecha_fin;

    if (!inicio || !fin) return [];

    return generarSemanasLaborales(inicio, fin);
  }, [periodoActivo]);

  useEffect(() => {
    if (!semanas.length) return;

    const hoy = new Date();

    const dia = hoy.getDay(); 
    const diff = hoy.getDate() - dia + (dia === 0 ? -6 : 1);

    const lunes = new Date(hoy.setDate(diff));

    const inicioSemana = lunes.toISOString().split("T")[0];

    const semanaActual = semanas.find(
      (s) => s.inicio <= inicioSemana && s.fin >= inicioSemana
    );

    setFechaSeleccionada(
      semanaActual?.inicio || inicioSemana
    );
  }, [semanas]);
  const semanaActiva = useMemo(() => {
    if (!fechaSeleccionada || semanas.length === 0) return null;

    // Creamos una fecha para evaluar el día de la semana
    const fechaEvaluar = new Date(fechaSeleccionada + "T12:00:00");
    const diaSemana = fechaEvaluar.getDay(); // 0 = Domingo, 6 = Sábado
    let fechaBusqueda = fechaSeleccionada;

    // Si es Domingo se restan 2 días para caer en viernes
    // Si es Sábado se resta 1 día para caer en viernes
    if (diaSemana === 0) {
      const d = new Date(fechaEvaluar);
      d.setDate(d.getDate() - 2);
      fechaBusqueda = d.toLocaleDateString("en-CA");
    } else if (diaSemana === 6) {
      const d = new Date(fechaEvaluar);
      d.setDate(d.getDate() - 1);
      fechaBusqueda = d.toLocaleDateString("en-CA");
    }
    //se busca la semana que contiene la fechaBusqueda
    const encontrada = semanas.find((s) => {
      return fechaBusqueda >= s.inicio && fechaBusqueda <= s.fin;
    });

    return encontrada || semanas[0];
  }, [fechaSeleccionada, semanas]);

  const dias = useMemo(() => {
    if (!fechaSeleccionada) return [];

    const fecha = new Date(fechaSeleccionada + "T00:00:00");

    const diaSemana = fecha.getDay();
    const diff = diaSemana === 0 ? -6 : 1 - diaSemana;

    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() + diff);

    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);

      return {
        id: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }).toUpperCase(),
      };
    });
  }, [fechaSeleccionada]);
  console.log("DATA CHECK:", data);
  console.log("BENEFICIARIOS CHECK:", data?.beneficiarios);
  const beneficiariosFiltrados = useMemo(() => {
    const lista = Array.isArray(data) ? data : [];

    const q = (search ?? "").trim().toLowerCase();

    if (!q) return lista;

    return lista.filter((b) =>
      (b.nombreCompleto ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const beneficiariosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * registrosPorPagina;

    return beneficiariosFiltrados.slice(
      inicio,
      inicio + registrosPorPagina
    );
  }, [beneficiariosFiltrados, pagina, registrosPorPagina]);
  const handleLocalChange = (payload) => {
    const hoy = new Date().toISOString().split("T")[0];

    if (payload.fecha_realizacion > hoy) {
      console.warn("No se puede registrar asistencia en fecha futura");
      return;
    }

    const key = `${payload.id_beneficiario}-${payload.fecha_realizacion}`;

    const beneficiarioOriginal = data?.find(
      b => b.id === payload.id_beneficiario
    );

    const idSeguimientoReal = beneficiarioOriginal?.id_seguimiento;

    setCambios((prev) => {
      const existente = prev[key] || {};

      return {
        ...prev,
        [key]: {
          ...existente,
          ...payload,
          id_seguimiento: payload.id_seguimiento || idSeguimientoReal,
        },
      };
    });
  };

  const onGuardar = () => {
    const listaCambios = Object.values(cambios);
    mutation.mutate(listaCambios);
  };

  if (isLoading) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f3f1f4]">

      <div className="w-72">
        <Lottie animationData={kidsAnimation} loop />
      </div>

      <p className="text-slate-600 font-medium text-lg">
        Cargando asistencias...
      </p>

      <p className="text-xs text-slate-400 mt-2">
        Preparando datos del periodo activo
      </p>

    </div>
  );
}

  if (isError)
    return (
      <div className="flex justify-center p-10 text-red-500">
        <AlertCircle />
      </div>
    ); 
  
  return (
    <section className="space-y-6">

      <EncabezadoPagina
        titulo="Gestión de Asistencias"
        descripcion={
          periodoActivo?.periodoActivo
            ? `Control de asistencias de comedor y psicología del periodo ${periodoActivo.periodoActivo.nombre || ""} (${periodoActivo.periodoActivo.ciclo_escolar || ""})`
            : "Control de asistencias de comedor y psicología"
        }
      />

      <div className="bg-white rounded-2xl shadow-sm">
        <AsistenciasFiltros
          search={search}
          filters={filters}
          onSearchChange={(v) =>
            setSearch(v)
          }
          onFilterChange={(k, v) =>
            setFilters((p) => ({
              ...p,
              [k]: v,
            }))
          }
          onClearFilters={() => {
            setSearch("");
            setFilters({
              servicio: "comedor",
            });
          }}
          fechaSeleccionada={
            fechaSeleccionada
          }
          onFechaChange={
            onFechaChangeSafe
          }
          min={limitesFecha.min}
          max={limitesFecha.max}
        />

        <AsistenciasTabla
          beneficiarios={beneficiariosPaginados}
          dias={dias}
          cambios={cambios}
          filters={filters}
          seguimientoMap={data?.seguimientoMap || {}}
          onCambio={handleLocalChange}
          onGuardar={onGuardarClick}
          guardando={mutation.isPending}
          hayCambios={statsCambios.total > 0}
        />

        {statsCambios.total > 0 && puedeEditar && (
          <div className="fixed bottom-10 right-10 z-50">
            <button
              onClick={onGuardarClick}
              disabled={mutation.isPending}
              className="bg-teal-600 text-white shadow-2xl px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : null}
              Guardar {statsCambios.total} cambios
            </button>
          </div>
        )}
        {mutation.isLoading && (
          <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center min-w-[320px]">

              <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <h3 className="font-semibold text-slate-800">
                Guardando asistencias...
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Esto puede tardar unos segundos.
              </p>

            </div>
          </div>
        )}
        <PaginacionTabla
          currentPage={pagina}
          totalPages={Math.ceil(
            beneficiariosFiltrados.length /
            registrosPorPagina
          )}
          totalItems={beneficiariosFiltrados.length}
          pageSize={registrosPorPagina}
          onPageChange={setPagina}
          onPageSizeChange={(size) => {
            setRegistrosPorPagina(size);
            setPagina(1);
          }}
        />
      </div>
      <ModalConfirmacion
        open={showConfirm}
        title="Confirmar Cambios"
        description={mensajeConfirmacion}
        confirmText="Sí, guardar"
        loading={mutation.isPending}
        onConfirm={confirmarGuardado}
        onClose={() => setShowConfirm(false)}
        color="teal"
      />
      <ModalResultado
        open={showResult}
        type="success"
        title="¡Guardado con éxito!"
        message="Las asistencias han sido actualizadas correctamente."
        onClose={() => setShowResult(false)}
      />
    </section>
  );
};

export default AsistenciasPagina;

