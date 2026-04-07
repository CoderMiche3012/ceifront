import { useEffect } from "react"
import { X } from "lucide-react"
import Avatar from "../Avatar"
import InsigniaRol from "../insignias/InsigniaRol"
import InsigniaEstatus from "../insignias/InsigniaEstatus"

export default function UsuarioVerModal({ open, user, onClose }) {
  
  // 1. Manejo de tecla ESC y bloqueo de scroll
  useEffect(() => {
    if (open) {
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Bloquea scroll del fondo
      
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset"; // Libera scroll
      };
    }
  }, [open, onClose]);

  if (!open || !user) return null;

  // Helper para datos opcionales
  const renderDato = (dato) => dato || <span className="italic text-slate-400 text-xs">No registrado</span>;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop con desenfoque (estilo moderno) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-800">
              Detalle de usuario
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-red-500 hover:shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-8 py-8 space-y-8">
          
          {/* Perfil Principal */}
          <div className="flex items-center gap-6">
            <div className="ring-4 ring-slate-50 rounded-full">
              <Avatar nombre={user.nombre} apellidoP={user.apellido_p} size="lg" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">
                {user.nombre|| ""} {user.apellido_p|| ""} {user.apellido_m|| ""}
              </h3>
              <p className="text-sm font-medium text-[#1f8a8a]">@{user.nom_usuario}</p>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid gap-4 sm:grid-cols-2">
            
            <InfoCard label="Correo electrónico" value={user.correo} />
            <InfoCard label="Teléfono" value={renderDato(user.telefono)} />
            
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Puesto</p>
              <div className="mt-2">
                <InsigniaRol roleId={user.id_rol} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Estado de Cuenta</p>
              <div className="mt-2">
                <InsigniaEstatus status={user.estatus} />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end bg-slate-50/50 border-t border-slate-100 px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-800 px-8 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95 shadow-lg shadow-slate-200"
          >
            Cerrar vista
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-componente para evitar repetición (Dry)
function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-[#1f8a8a]/30">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700 break-all">
        {value}
      </p>
    </div>
  );
}