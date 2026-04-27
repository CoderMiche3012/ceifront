export default function AvatarGeneral({
  nombre,
  apellidoP,
  className = "h-10 w-10 text-xs",
}) {
  const initials =
    `${nombre?.[0] || ""}${apellidoP?.[0] || ""}`.toUpperCase();

  const colors = [
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
  ];

  const charCodeSum = initials
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const colorIndex = charCodeSum % colors.length;
  const { bg, text } = colors[colorIndex];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${bg} ${text} ${className}`}
    >
      {initials}
    </div>
  );
}