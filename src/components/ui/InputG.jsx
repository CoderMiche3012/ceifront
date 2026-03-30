// Input.jsx
export default function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-slate-700 outline-none transition focus:border-[#0E5F63] focus:ring-4 focus:ring-[#0E5F63]/10 ${
        props.disabled ? "bg-slate-100 opacity-70" : ""
      }`}
    />
  );
}