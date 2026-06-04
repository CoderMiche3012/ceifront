export const modal = {
  overlay: `fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 `,

  container: `w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl`,

  header: "flex items-start gap-4",

  iconWrapper: ` flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl `,

  title: "text-xl font-bold text-[#1e293b]",

  description: "mt-1 text-sm text-[#64748b] leading-6",

  actions: `mt-8 flex justify-end gap-3`,

  cancelButton: `
    rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600transition
    hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60
  `,

  confirmButton: `
    inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white
    transition disabled:cursor-not-allowed disabled:opacity-60
  `,

  colors: {
    teal: {
      icon: "bg-teal-100 text-teal-600",
      button: "bg-teal-600 hover:bg-teal-700",
    },
    amber: {
      icon: "bg-amber-100 text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700",
    },
    red: {
      icon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    green: {
      icon: "bg-green-100 text-green-600",
      button: "bg-[#1e9543] hover:bg-[#187a38]",
    },
  },

  result: {
    closeButton: `rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 `,
    colors: {
      success: {
        icon: "bg-green-100 text-green-600",
        button: "bg-green-600 hover:bg-green-700",
      },

      error: {
        icon: "bg-red-100 text-red-600",
        button: "bg-red-600 hover:bg-red-700",
      },

      warning: {
        icon: "bg-amber-100 text-amber-600",
        button: "bg-amber-500 hover:bg-amber-600",
      },

      info: {
        icon: "bg-blue-100 text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
      },
    },
  },
  formOverlay: `fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 `,
  
  formContainer: `flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl `,
  
  formHeader: `shrink-0 flex items-center gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-5 `,
  
  formBody: `flex min-h-0 flex-1 flex-col px-6 py-5`,
  
  formScroll: `min-h-0 flex-1 overflow-y-auto pr-2 custom-scroll`,
  
  twoCols: "grid grid-cols-1 gap-6 sm:grid-cols-2",

  formActions: `mt-3 shrink-0 flex justify-end gap-3 border-t border-slate-100 bg-white pt-3`,

};