export default function Avatar({ nombre, apellidoP,className = "h-10 w-10 text-xs",dynamicColor = true,}) {

  const initials = `${nombre?.[0] || ""}${apellidoP?.[0] || ""}`.toUpperCase();
  const colors = [
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
  ];

  const defaultColor = { bg: "bg-[#dbeafe]", text: "text-[#1f8a8a]", };
  const charSum = [...initials].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const selectedColor = dynamicColor ? colors[charSum % colors.length] : defaultColor;

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-bold ${selectedColor.bg} ${selectedColor.text} ${className}`} >
      {initials}
    </div>
  );
}