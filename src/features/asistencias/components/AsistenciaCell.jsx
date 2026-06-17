import React, { memo, useRef, useState } from "react";
import { Check, Minus, Plus, Users, X } from "lucide-react";

const AsistenciaCell = memo(({ dato, onCambio }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);

  const asistencia = dato?.asistencia === true;
  const acompanantes = dato?.numero_acompanantes || 0;

  const idSeguimiento = dato?.id_seguimiento;

  const abrirDialog = () => {
    const rect = buttonRef.current?.getBoundingClientRect();

    const dialogHeight = 220;
    const dialogWidth = 192;

    let top = rect
      ? rect.bottom + 12
      : window.innerHeight / 2;

    let left = rect
      ? rect.left + rect.width / 2 - dialogWidth / 2
      : window.innerWidth / 2 - dialogWidth / 2;

    top = Math.max(10, Math.min(top, window.innerHeight - dialogHeight - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - dialogWidth - 10));

    setPosition({ top, left });
    setOpen(true);
  };

  const marcarAsistencia = () => {
    onCambio({
      ...dato,
      asistencia: true,
      id_seguimiento: idSeguimiento,
    });

    abrirDialog();
  };

  const marcarFalta = () => {
    onCambio({
      ...dato,
      asistencia: false,
      numero_acompanantes: 0,
      id_seguimiento: idSeguimiento,
    });

    setOpen(false);
  };

  const cambiarAcompanantes = (valor) => {
    onCambio({
      ...dato,
      numero_acompanantes: valor,
      id_seguimiento: idSeguimiento,
    });
  };

  return (
    <div className="relative flex items-center justify-center h-16 min-w-[110px]">

      <button
        ref={buttonRef}
        onClick={() => {
          if (!asistencia) {
            marcarAsistencia();
          } else {
            abrirDialog();
          }
        }}
        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-105
          ${asistencia
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-white border-slate-300 hover:border-emerald-400"
          }`}
      >
        {asistencia && <Check size={16} strokeWidth={3} />}
      </button>

      {asistencia && acompanantes > 0 && (
        <div className="absolute -top-1 right-2 min-w-[20px] h-5 px-1 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
          {acompanantes}
        </div>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 w-48 rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Users size={13} className="text-sky-500" />
                Acompañantes
              </div>

              <button onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-center gap-3">

              <button
                onClick={() =>
                  cambiarAcompanantes(Math.max(0, acompanantes - 1))
                }
                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100"
              >
                <Minus size={14} />
              </button>

              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <span className="text-lg font-bold text-sky-700">
                  {acompanantes}
                </span>
              </div>

              <button
                onClick={() =>
                  cambiarAcompanantes(acompanantes + 1)
                }
                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="px-3 pb-3 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-xl text-sm bg-slate-100"
              >
                Cerrar
              </button>

              <button
                onClick={marcarFalta}
                className="flex-1 py-2 rounded-xl text-sm bg-rose-50 text-rose-600"
              >
                Falta
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default AsistenciaCell;
