export default function AvatarGeneral({ nombre, apellidoP }) {
  const initials = `${nombre?.[0] || ""}${apellidoP?.[0] || ""}`.toUpperCase();
  
  // Colores suaves (bg) y fuertes (text) para el diseño
  const colors = [
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
  ];

  // Selección "aleatoria" pero consistente basada en el código de las letras
  const charCodeSum = initials.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = charCodeSum % colors.length;
  const { bg, text } = colors[colorIndex];

  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg} ${text} text-xs font-bold`}>
      {initials}
    </div>
  );
}