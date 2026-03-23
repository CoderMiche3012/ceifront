export default function Input({ label, type = "text", placeholder, value, onChange, }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-50"
      />
    </div>
  )
}