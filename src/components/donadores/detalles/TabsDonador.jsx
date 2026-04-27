export default function TabsDonador({ tab, setTab }) {
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
        onClick={() => setTab("familia")}
        className={`pb-2 text-sm font-medium ${
          tab === "donativo"
            ? "border-b-2 border-teal-600 text-teal-600"
            : "text-slate-500"
        }`}
      >
        Donativos
      </button>

        
    </div>
  );
}