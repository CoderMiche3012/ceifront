import { useState, useMemo } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

export default function HistorialBase({
  title = "Historial",
  items = [],
  periodos = [],
  periodoActivo,
  renderTitulo,     // 👈 cambia texto principal
  renderSubtitulo,  // 👈 cambia nivel/grado/etc
  renderMeta,       // 👈 derecha (promedio, cantidad, etc)
  renderDetalle,    // 👈 panel expandible
}) {
  const [abierto, setAbierto] = useState(null);

  const periodosMap = useMemo(() => {
    return Object.fromEntries(periodos.map((p) => [p.id_periodo, p]));
  }, [periodos]);

  const listaOrdenada = useMemo(() => {
    const activo = [];
    const inactivo = [];

    for (const item of items) {
      if (item.id_periodo === periodoActivo?.id_periodo) {
        activo.push(item);
      } else {
        inactivo.push(item);
      }
    }

    return [
      ...activo,
      ...inactivo.sort((a, b) => b.id_periodo - a.id_periodo),
    ];
  }, [items, periodoActivo]);

  const toggle = (id) => {
    setAbierto((prev) => (prev === id ? null : id));
  };

  if (!listaOrdenada.length) {
    return (
      <div className="rounded-2xl bg-white p-6 border border-slate-200">
        <p className="text-sm text-slate-500 text-center">
          Sin registros
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>

      <div className="space-y-3">
        {listaOrdenada.map((item) => {
          const periodo = periodosMap[item.id_periodo];
          const isOpen = abierto === item.id_seguimiento;

          return (
            <div key={item.id_seguimiento}>
              <div
                onClick={() => toggle(item.id_seguimiento)}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50 transition cursor-pointer"
              >
                {/* IZQUIERDA */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <BookOpen size={18} />
                  </div>

                  <div>
                    {renderTitulo ? (
                      renderTitulo(item, periodo)
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">
                        {periodo?.ciclo_escolar || "Ciclo"}
                      </p>
                    )}

                    {renderSubtitulo?.(item)}
                  </div>
                </div>

                {/* DERECHA */}
                <div className="flex items-center gap-3">
                  {renderMeta?.(item)}

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* DETALLE */}
              <div className={isOpen ? "mt-2" : "hidden"}>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  {renderDetalle?.(item)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}