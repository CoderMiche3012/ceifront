import { useState, useRef, useEffect, useCallback } from "react";
import { MoreVertical, UserPen, CalendarPlus, CheckCircle, FileText, CalendarClock, Ban } from "lucide-react";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { useAccionesVisita } from "../../hooks/useAccionesVisita";
import { FormAgendar, FormFinalizar, FormCancelar } from "../modales/VisitaForms";
import EstudioCard from "../detalles/visitas/EstudioCard";


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
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", () => setMenuOpen(false), { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", () => setMenuOpen(false));
    };
  }, [menuOpen]);
  //para abrir modal y cerrar menú simultáneamente
  const handleAction = (mode) => {
    setModalMode(mode);
    setMenuOpen(false);
  };

  const renderOpciones = () => {
    const btnClass = "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors";
    switch (estatus) {
      case "no agendada":
        return (
          <button onClick={() => handleAction('agendar')} className={`${btnClass} text-blue-600 hover:bg-blue-50`}>
            <CalendarPlus size={16} /> Programar visita
          </button>
        );
      case "programada":
        return (
          <>
            <button onClick={() => handleAction('finalizar')} className={`${btnClass} text-green-600 hover:bg-green-50`}>
              <CheckCircle size={16} /> Marcar como realizada
            </button>
            <button onClick={() => handleAction('agendar')} className={`${btnClass} text-amber-600 hover:bg-amber-50`}>
              <CalendarClock size={16} /> Reprogramar
            </button>
            <button onClick={() => handleAction('cancelar')} className={`${btnClass} text-red-600 hover:bg-red-50`}>
              <Ban size={16} /> Cancelar
            </button>
          </>
        );
      case "realizada":
        return (
          <button
            onClick={() => handleAction("capturar_estudio")}
            className={`${btnClass} text-indigo-600 hover:bg-indigo-50`}
          >
            <FileText size={16} /> Capturar Estudio
          </button>
        );
      default:
        return (
          <button onClick={() => handleAction('agendar')} className={`${btnClass} text-amber-600 hover:bg-amber-50`}>
            <CalendarClock size={16} /> Reintentar Visita
          </button>
        );
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${menuOpen ? 'bg-slate-200 text-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        <MoreVertical size={18} />
      </button>
      {menuOpen && (
        <div
          className={`
            fixed z-[9999] w-56 rounded-xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-100
          `}
          style={{
            top: menuRef.current?.getBoundingClientRect().top + (abrirHaciaArriba ? -8 : 35) + 'px',
            left: menuRef.current?.getBoundingClientRect().left - 200 + 'px',
            transform: abrirHaciaArriba ? 'translateY(-100%)' : 'none'
          }}
        >
          <div className="py-1">
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <UserPen size={16} /> Editar Perfil
            </button>
            <div className="my-1 border-t border-slate-100" />
            {renderOpciones()}
          </div>
        </div>
      )}

      {modalMode && (
        <ModalConfirmacion
          open={true}
          color={modalMode === 'cancelar' ? 'red' : modalMode === 'finalizar' ? 'green' : 'teal'}
          title={
            modalMode === 'agendar' ? "Programar Visita" :
              modalMode === 'finalizar' ? "Finalizar Visita" :
                "Confirmar Cancelación"
          }
          description={
            <div className="mt-4">
              {modalMode === 'agendar' && <FormAgendar data={formData} onChange={setFormData} />}
              {modalMode === 'finalizar' && <FormFinalizar data={formData} onChange={setFormData} />}
              {modalMode === 'cancelar' && <FormCancelar data={formData} onChange={setFormData} />}
            </div>
          }
          onConfirm={ejecutarAccion}
          onClose={() => setModalMode(null)}
          loading={loading}
          confirmText={modalMode === 'cancelar' ? "Sí, Cancelar" : "Guardar Cambios"}
        />
      )}
      {modalMode === "capturar_estudio" && (
        <ModalConfirmacion
          open={true}
          color="indigo"
          title="Capturar estudio socioeconómico"
          description={
            <div className="mt-4">
              <EstudioCard
                data={item}
                setData={(updater) => {
                  if (typeof updater === "function") {
                    onRefresh?.();
                  }
                }}
              />
            </div>
          }
          onConfirm={() => setModalMode(null)}
          onClose={() => setModalMode(null)}
          confirmText="Cerrar"
          showCancel={false}
        />
      )}
      <ModalResultado
        {...result}
        onClose={() => setResult(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
}