// Field.jsx
export default function Field({ label, required, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-bold uppercase tracking-wide text-slate-500">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}