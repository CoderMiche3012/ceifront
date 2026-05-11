import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function TabsExpediente({ tab, setTab }) {
  const [openBeneficios, setOpenBeneficios] = useState(false);

  const tabs = [
    { id: "generales", label: "Datos generales" },
    { id: "familia", label: "Familia" },
    { id: "escuela", label: "Escuela" },
  ];

  const beneficiosTabs = [
    { id: "apoyos", label: "Apoyos económicos" },
    { id: "asistencias", label: "Comedor y psicología" },
  ];

  const beneficiosActivo = beneficiosTabs.some((b) => b.id === tab);

  return (
    <div role="tablist" className="flex gap-8 items-center relative">
      
      {/* Tabs normales */}
      {tabs.map((t) => {
        const active = tab === t.id;

        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => setTab(t.id)}
            className={`relative pb-3 text-sm font-semibold transition-all duration-200 ${
              active
                ? "text-teal-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}

            {active && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
        );
      })}

      {/* Beneficios con submenu */}
      <div className="relative">
        <button
          onClick={() => setOpenBeneficios(!openBeneficios)}
          className={`relative pb-3 flex items-center gap-1 text-sm font-semibold transition-all duration-200 ${
            beneficiosActivo
              ? "text-teal-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Beneficios

          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              openBeneficios ? "rotate-180" : ""
            }`}
          />

          {beneficiosActivo && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
          )}
        </button>

        {/* Dropdown */}
        {openBeneficios && (
          <div className="absolute top-12 left-0 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
            {beneficiosTabs.map((item) => {
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setOpenBeneficios(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}