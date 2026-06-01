import { ui } from "../../styles/ui/uiClasses";

//para los modales
export default function Field({ label, required, error, children }) {
  return (
    <div className={ui.form.field}>
      <label className={ui.form.label}>
        {label}
        {required && <span className={ui.form.required}> *</span>}
      </label>

      {children}

      {error && (
        <p className="text-sm text-rose-600 mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}