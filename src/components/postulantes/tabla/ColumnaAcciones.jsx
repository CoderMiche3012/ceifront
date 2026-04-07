import { useState, useRef, useEffect } from "react";
import { MoreVertical, UserPen, CalendarPlus, CheckCircle, FileText, CalendarClock, Ban } from "lucide-react";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import ModalResultado from "../../shared/ModalResultado";
import { useAccionesVisita } from "../../../hooks/postulantes/useAccionesVisita";
import { FormAgendar, FormFinalizar } from "../modales/VisitaForms";

export default function AccionesPostulante({ item, onRefresh, abrirHaciaArriba }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const {
    modalMode, setModalMode,
    loading,
    formData, setFormData,
    result, setResult,
    ejecutarAccion
  } = useAccionesVisita(item, onRefresh);

  const estatus = item.estado_visita?.toLowerCase();

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const renderOpciones = () => {
    const btnClass = "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors";

    switch (estatus) {
      case "no agendada":
        return (
          <button onClick={() => setModalMode('agendar')} className={`${btnClass} text-blue-600 hover:bg-blue-50`}>
            <CalendarPlus size={16} /> Programar visita
          </button>
        );
      case "programada":
        return (
          <>
            <button onClick={() => setModalMode('finalizar')} className={`${btnClass} text-green-600 hover:bg-green-50`}>
              <CheckCircle size={16} /> Marcar como realizada
            </button>
            <button onClick={() => setModalMode('agendar')} className={`${btnClass} text-amber-600 hover:bg-amber-50`}>
              <CalendarClock size={16} /> Reprogramar
            </button>
            <button onClick={() => setModalMode('cancelar')} className={`${btnClass} text-red-600 hover:bg-red-50`}>
              <Ban size={16} /> Cancelar
            </button>
          </>
        );
      case "realizada":
        return (
          <button className={`${btnClass} text-indigo-600 hover:bg-indigo-50`}>
            <FileText size={16} /> Capturar Estudio
          </button>
        );
      default:
        return (
          <button onClick={() => setModalMode('agendar')} className={`${btnClass} text-amber-600 hover:bg-amber-50`}>
            <CalendarClock size={16} /> Reintentar Visita
          </button>
        );
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
        <MoreVertical size={18} />
      </button>

      {menuOpen && (
        <div
          className={`
      fixed z-[9999] w-56 rounded-xl border border-slate-200 bg-white shadow-2xl
      ${abrirHaciaArriba ? '-translate-y-[110%]' : 'translate-y-2'}
    `}
          style={{
            // Esto posiciona el menú exactamente donde está el botón
            top: menuRef.current?.getBoundingClientRect().top + (abrirHaciaArriba ? 0 : 40) + 'px',
            left: menuRef.current?.getBoundingClientRect().left - 180 + 'px',
          }}
        >
          {/* Explicación de clases:
             - bottom-full: coloca el inicio del div arriba del botón.
             - mb-2: le da una pequeña separación.
             - origin-bottom: para que la animación (si tienes) empiece desde abajo.
          */}
          <div className="py-1">
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <UserPen size={16} /> Editar Perfil
            </button>
            <div className="my-1 border-t border-slate-100" />
            {renderOpciones()}
          </div>
        </div>
      )}

      {/* MODAL DINÁMICO SEGÚN MODO */}
      {modalMode && (
        <ModalConfirmacion
          open={true}
          color={modalMode === 'cancelar' ? 'red' : modalMode === 'finalizar' ? 'green' : 'teal'}
          title={modalMode === 'agendar' ? "Programar Visita" : modalMode === 'finalizar' ? "Finalizar Visita" : "Confirmar Cancelación"}
          description={
            modalMode === 'agendar' ? <FormAgendar data={formData} onChange={setFormData} /> :
              modalMode === 'finalizar' ? <FormFinalizar data={formData} onChange={setFormData} /> :
                "¿Estás seguro de cancelar esta visita? El registro permanecerá pero sin fecha activa."
          }
          onConfirm={ejecutarAccion}
          onClose={() => setModalMode(null)}
          loading={loading}
          confirmText={modalMode === 'cancelar' ? "Sí, Cancelar" : "Guardar Cambios"}
        />
      )}

      <ModalResultado {...result} onClose={() => setResult({ ...result, open: false })} />
    </div>
  );
}