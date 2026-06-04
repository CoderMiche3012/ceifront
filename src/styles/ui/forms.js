export const form = {
  field: "space-y-2",

  label: `block text-[13px] font-bold uppercase tracking-wide text-[#64748b]`,

  required: "text-rose-500",
};

export const input = {
  base: `
    w-full
    rounded-2xl
    border
    px-4 py-3
    text-sm
    transition-all duration-300

    border-slate-200
    bg-white
    text-slate-700
    placeholder:text-slate-400

    hover:border-slate-300
    hover:shadow-sm

    focus:border-[#0E5F63]
    focus:ring-[5px]
    focus:ring-[#0E5F63]/5
    focus:bg-white
    focus:outline-none

    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-400
    disabled:opacity-75
  `,
};