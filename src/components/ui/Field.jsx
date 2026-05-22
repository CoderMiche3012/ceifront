import { ui } from "../../styles/uiClasses";

export default function Field({label,required,children,}) {
  return (
    <div className={ui.form.field}>
      <label className={ui.form.label}>
        {label}
        {required && (
          <span className={ui.form.required}>
            {" "}*
          </span>
        )}
      </label>

      {children}
    </div>
  );
}