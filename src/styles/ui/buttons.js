export const button = {
  base: `
    inline-flex items-center justify-center gap-2
    rounded-2xl whitespace-nowrap
    transition-all duration-200 active:scale-95
  `,

  sm: "h-10 px-4 text-sm font-medium",

  md: "h-11 px-5 text-base font-medium",

  primary:
    "bg-[#0e5f63] text-white hover:bg-[#0d6f6b]",

  secondary:
    "border border-[#dbe3eb] bg-transparent text-[#475569] hover:bg-slate-50",

  danger:
    "bg-red-500 text-white hover:bg-red-600",
};