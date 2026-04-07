import { useState, useRef, useEffect } from "react";
import { MoreVertical, UserPen, CalendarPlus, CheckCircle, FileText, CalendarClock, Ban, X } from "lucide-react";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import ModalResultado from "../../shared/ModalResultado";
import { actualizarVisita } from "../../../services/visitasApi";
import { crearVisita } from "../../../services/visitasApi";

export default function AccionesPostulante({ item, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  
  // Modales y Resultados
  const [modalMode, setModalMode] = useState(null); // 'agendar', 'finalizar', 'cancelar'
  const [result, setResult] = useState({ open: false, type: "success", title: "", message: "" });
  
  // Formulario temporal
  const [formData, setFormData] = useState({ fecha: "", hora: "", nota: "" });

  const estatus = item.estado_visita?.toLowerCase();

  const handleAction = async (tipo) => {
    setLoading(true);
    try {
      if (tipo === 'agendar') {
        if (!formData.fecha || !formData.hora) throw new Error("Debes seleccionar fecha y hora");
        
        // Formato ISO: 2026-04-10T04:30:00-06:00
        const fechaIso = `${formData.fecha}T${formData.hora}:00-06:00`;
        
        await crearVisita({
          id_postulante: item.id_postulante,
          fecha_visita: fechaIso,
          estado_visita: "Programada"
        });
      } else if (tipo === 'finalizar') {
        await actualizarVisita(item.id_postulante, {
          estado_visita: "Realizada",
          nota_visita: formData.nota
        });
      } else if (tipo === 'cancelar') {
        await actualizarVisita(item.id_postulante, {
          estado_visita: "Cancelada"
        });
      }
      
      setResult({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: "La información se ha actualizado correctamente."
      });
      setModalMode(null);
      setIsOpen(false);
      onRefresh(); 
    } catch (error) {
      setResult({ open: true, type: "error", title: "Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderOpcionesDinamicas = () => {
    switch (estatus) {
      case "no agendada":
        return (
          <button onClick={() => setModalMode('agendar')} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
            <CalendarPlus size={16} /> Programar visita
          </button>
        );
      case "programada":
        return (
          <>
            <button onClick={() => setModalMode('finalizar')} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50">
              <CheckCircle size={16} /> Marcar como realizada
            </button>
            <button onClick={() => setModalMode('agendar')} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">
              <CalendarClock size={16} /> Reprogramar visita
            </button>
            <button onClick={() => setModalMode('cancelar')} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <Ban size={16} /> Cancelar visita
            </button>
          </>
        );
      case "realizada":
        return (
          <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50">
            <FileText size={16} /> Capturar estudio socioeconómico
          </button>
        );
      case "cancelada":
        return (
          <button onClick={() => setModalMode('agendar')} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 font-medium">
            <CalendarClock size={16} /> Reprogramar visita
          </button>
        );
      default: return null;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="rounded-full p-2 hover:bg-slate-100 text-slate-500 transition-colors">
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          <div className="py-1">
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <UserPen size={16} /> Editar postulante
            </button>
            <div className="my-1 border-t border-slate-100" />
            {renderOpcionesDinamicas()}
          </div>
        </div>
      )}

      {/* MODAL PARA AGENDAR / FINALIZAR */}
      {(modalMode === 'agendar' || modalMode === 'finalizar') && (
        <ModalConfirmacion
          open={true}
          color={modalMode === 'agendar' ? "teal" : "green"}
          title={modalMode === 'agendar' ? "Datos de la Visita" : "Finalizar Visita"}
          description={
            <div className="mt-4 space-y-4 text-left">
              {modalMode === 'agendar' ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha</label>
                    <input type="date" className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" 
                           onChange={(e) => setFormData({...formData, fecha: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Hora</label>
                    <input type="time" className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" 
                           onChange={(e) => setFormData({...formData, hora: e.target.value})} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Notas de la visita</label>
                  <textarea className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/20" rows="3" 
                            placeholder="Escribe el resultado..."
                            onChange={(e) => setFormData({...formData, nota: e.target.value})} />
                </div>
              )}
            </div>
          }
          onConfirm={() => handleAction(modalMode)}
          onClose={() => setModalMode(null)}
          loading={loading}
          confirmText={modalMode === 'agendar' ? "Programar Ahora" : "Guardar Nota"}
        />
      )}

      {/* MODAL PARA CANCELAR */}
      {modalMode === 'cancelar' && (
        <ModalConfirmacion
          open={true}
          color="red"
          title="¿Confirmar Cancelación?"
          description="La visita se marcará como cancelada. Esta acción no elimina al postulante, solo el evento de visita."
          onConfirm={() => handleAction('cancelar')}
          onClose={() => setModalMode(null)}
          loading={loading}
          confirmText="Sí, Cancelar"
        />
      )}

      <ModalResultado {...result} onClose={() => setResult({ ...result, open: false })} />
    </div>
  );
}