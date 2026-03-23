export default function BotonInicio({ children, type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-xl bg-[#0E5F63] px-4 py-3 text-base font-bold text-white shadow-[0_8px_20px_rgba(15,127,122,0.18)] transition hover:bg-[#0d6f6b]"
    >
      {children}
    </button>
  )
}
