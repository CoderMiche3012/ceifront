// Input.jsx
export default function Input(props) {
  return (
    <input
      {...props}
      className={`
        w-full rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300
        /* Colores base y borde */
        border-slate-200 bg-white text-slate-700
        placeholder:text-slate-400
        
        /* Efecto Hover */
        hover:border-slate-300 hover:shadow-sm
        
        /* Estado Focus (Personalizado con tu color #0E5F63) */
        focus:border-[#0E5F63] focus:ring-[5px] focus:ring-[#0E5F63]/5 
        focus:bg-white focus:outline-none
        
        /* Estado Disabled */
        disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-75
        
        /* Inyección de clases externas */
        ${props.className || ""}
      `}
    />
  );
}