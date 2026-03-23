export default function Avatar({ nombre, apellidoP }) {
  const initials = `${nombre?.[0] || ""}${apellidoP?.[0] || ""}`.toUpperCase()
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-xs font-bold text-[#1f8a8a]">
      {initials}
    </div>
  )
}