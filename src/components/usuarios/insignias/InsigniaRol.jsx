export default function InsigniaRol({ label }) {
  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase leading-none bg-slate-100 text-slate-600"
    >
      {label || "Sin rol"}
    </span>
  )
}