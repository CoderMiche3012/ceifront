export default function TabsExpediente({ tab, setTab }) {
  return (
    <div className="flex gap-6 border-b border-slate-200">
      <button
        onClick={() => setTab("generales")}
        className={`pb-2 text-sm font-medium ${
          tab === "generales"
            ? "border-b-2 border-teal-600 text-teal-600"
            : "text-slate-500"
        }`}
      >
        Datos generales
      </button>

      <button
        onClick={() => setTab("Visita")}
        className={`pb-2 text-sm font-medium ${
          tab === "Visita"
            ? "border-b-2 border-teal-600 text-teal-600"
            : "text-slate-500"
        }`}
      >
        Visita
      </button>
    </div>
  );
}