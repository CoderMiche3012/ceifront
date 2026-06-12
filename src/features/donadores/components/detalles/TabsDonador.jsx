import { usePermissions } from "../../../../context/PermissionsContext";

export default function TabsDonador({ tab, setTab }) {

  const { hasModulePermission } = usePermissions();

  const canViewDonativos = hasModulePermission("donativos", "ver");

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

      {canViewDonativos && (
        <button
          onClick={() => setTab("donativo")}
          className={`pb-2 text-sm font-medium ${
            tab === "donativo"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-slate-500"
          }`}
        >
          Donativos
        </button>
      )}

    </div>
  );
}