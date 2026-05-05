export default function TabsExpediente({ tab, setTab }) {
  const tabs = [
    { id: "generales", label: "Datos generales" },
    { id: "familia", label: "Familia" },
    { id: "escuela", label: "Escuela" },
  ];

  return (
    <div role="tablist" className="flex gap-8">

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

    </div>
  );
}