import { uiTheme } from "./uiTheme";

export const ui = {
  // layout
  page: uiTheme.spacing.page,
  section: uiTheme.spacing.section,
  block: uiTheme.spacing.block,
  gap: uiTheme.spacing.gap,

  header: {
    container: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
    description: "text-sm text-[#64748b] mt-1",
  },

  // cards

  card: `
  bg-white
  border border-[#dbe3eb]
  rounded-[24px]
  shadow-[0_1px_2px_rgba(15,23,42,0.03)]
  p-6
`,

  cardCompact: `
    bg-white
    border border-[#dbe3eb]
    rounded-[16px]
  `,

  // UI elements
  iconBox: `
    flex items-center justify-center
    rounded-2xl
    bg-[#f0f9f6]
  `,

  primaryIcon: "text-[#0e6b62]",

  // typography
  text: {
    ...uiTheme.typography,
  },

  // buttons
  button: {
    base: `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    whitespace-nowrap
    transition-all
    duration-200
    active:scale-95
  `,

  sm: `
    h-10
    px-4
    text-sm
    font-medium
  `,

  md: `
    h-11
    px-5
    text-base
    font-medium
  `,

    primary: `
  bg-[#0e5f63]
  text-white
  hover:bg-[#0d6f6b]
  shadow-[0_10px_24px_rgba(15,127,122,0.20)]
`,

    secondary: `
  border border-[#dbe3eb]
  bg-transparent
  text-[#475569]
  hover:bg-slate-50
`,

    danger: `
      bg-red-500
      text-white
      hover:bg-red-600
    `,
  },
  table: {
    wrapper: "overflow-x-auto",

    table: "w-full min-w-[980px]",

    headerRow: "border-b border-[#edf2f7] text-left",

    headerCell: `
    px-6 py-5
    text-[11px]
    font-bold
    uppercase
    tracking-wide
    text-[#94a3b8]
  `,

    row: "border-b border-[#f1f5f9] last:border-b-0",

    cell: "px-6 py-5 align-middle",

    empty: "px-6 py-10 text-center text-sm text-[#94a3b8]",
  },
  badge: {
    base: `
    inline-flex
    rounded-full
    px-3 py-1
    text-xs
    font-semibold
  `,

    activo: "bg-emerald-100 text-emerald-700",

    inactivo: "bg-rose-100 text-rose-700",

    pendiente: "bg-amber-100 text-amber-700",

    default: "bg-slate-100 text-slate-700",
  },
  filters: {
    container: "border-b border-[#edf2f7] px-5 py-4",

    layout: "flex flex-col gap-4 xl:flex-row xl:items-center",

    searchWrapper: "relative flex-1",

    searchIcon:
      "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]",

    input: `
    h-11 w-full
    rounded-xl
    border border-[#d9e1ea]
    bg-[#fcfdff]
    pl-11 pr-4
    text-sm
    outline-none
    placeholder:text-[#94a3b8]
    focus:border-[#94a3b8]
  `,

    controls: "flex flex-wrap items-center gap-6",

    select: `
    h-11
    min-w-[150px]
    rounded-xl
    border border-[#d9e1ea]
    bg-white
    px-4
    text-sm
    text-[#64748b]
    outline-none
  `,

    clearButton: `
    inline-flex
    h-11
    items-center
    gap-2
    rounded-xl
    px-2
    text-sm
    text-[#94a3b8]
    hover:text-[#64748b]
  `,
  },
  alert: {
    base: `
    p-4
    rounded-2xl
    border-l-4
    flex items-center gap-3
    animate-in fade-in slide-in-from-top-2 duration-300
  `,

    text: "text-xs font-bold leading-snug",

    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
      icon: "text-red-500",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-700",
      icon: "text-green-500",
    },
  },
  pagination: {
    container: `
    flex flex-col gap-4
    border-t border-[#edf2f7]
    px-5 py-4
    sm:flex-row
    sm:items-center
    sm:justify-between
  `,

    text: "text-xs text-[#64748b]",

    controls: "flex items-center gap-2",

    arrow: `
    flex h-8 w-8
    items-center justify-center
    rounded-lg
    border border-[#d9e1ea]
    text-[#94a3b8]
    disabled:opacity-40
  `,

    page: `
    flex h-8 min-w-8
    items-center justify-center
    rounded-lg px-2
    text-sm font-semibold
  `,

    pageActive: "bg-[#1f8a8a] text-white",

    pageInactive: "text-[#64748b]",
  },
  form: {
    field: "space-y-2",

    label: `
    block
    text-[13px]
    font-bold
    uppercase
    tracking-wide
    text-[#64748b]
  `,

    required: "text-rose-500",
  },
  input: {
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
  },
  modal: {
    overlay: `
    fixed inset-0 z-[60]
    flex items-center justify-center
    bg-black/50 px-4
  `,

    container: `
    w-full max-w-md
    rounded-2xl
    bg-white
    p-6
    shadow-2xl
  `,

    header: "flex items-start gap-4",

    iconWrapper: `
  flex h-14 w-14
  shrink-0
  items-center justify-center
  rounded-2xl
`,

    title: "text-xl font-bold text-[#1e293b]",

    description: "mt-1 text-sm text-[#64748b] leading-6",

    actions: `mt-8 flex justify-end gap-3`,

    cancelButton: `
    rounded-xl
    border border-slate-300
    bg-white
    px-4 py-2.5
    text-sm font-semibold
    text-slate-600
    transition
    hover:bg-slate-50
    disabled:cursor-not-allowed
    disabled:opacity-60
  `,

    confirmButton: `
    inline-flex items-center justify-center
    rounded-xl
    px-5 py-2.5
    text-sm font-semibold
    text-white
    transition
    disabled:cursor-not-allowed
    disabled:opacity-60
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
      closeButton: `
    rounded-lg
    p-2
    text-slate-400
    transition
    hover:bg-slate-100
    hover:text-slate-600
  `,

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
    formOverlay: `
  fixed inset-0 z-50
  flex items-center justify-center
  bg-slate-900/50
  backdrop-blur-sm
  p-4
`,

    formContainer: `
  w-full max-w-2xl
  overflow-hidden
  rounded-[32px]
  bg-white
  shadow-2xl
`,

    formHeader: `
  flex items-center gap-4
  border-b border-slate-100
  bg-slate-50/50
  px-6 py-5
`,

    formBody: "space-y-6 p-6 sm:p-8",

    twoCols: "grid grid-cols-1 gap-6 sm:grid-cols-2",

    formActions: `
  mt-8
  flex flex-col-reverse
  justify-end
  gap-4
  border-t border-slate-100
  pt-6
  sm:flex-row
`,
  },
  headerBar: {
    container: `
    sticky top-0 z-50
    flex h-20 items-center justify-between
    border-b border-slate-200
    bg-white
    px-4 md:px-8
  `,

    menuButton: `
    flex h-11 w-11
    items-center justify-center
    rounded-2xl
    text-slate-500
    transition-all
    hover:bg-slate-100
    active:scale-95
  `,

    brand: "hidden sm:flex items-center gap-3",

    logoWrapper: `
    p-2
    rounded-2xl
    border border-[#dbe3eb]
    bg-white
    shadow-[0_1px_2px_rgba(15,23,42,0.03)]
  `,

    logo: "h-17 w-17 object-contain",

    brandText: "flex flex-col leading-tight",

    brandTitle: `text-xl font-bold text-[#1e293b]`,

    brandSubtitle: "text-sm text-[#64748b]",
  },
  userMenu: {
    wrapper: "relative",

    trigger: `
    flex items-center gap-3
    rounded-2xl
    px-3 py-2
    transition-all
    hover:bg-slate-100/80
    active:scale-95
  `,

    name: "text-base font-semibold text-[#1e293b] leading-tight",
    dropdownName: "truncate font-semibold text-lg",
    dropdownEmail: "truncate text-xs text-teal-50/80 mt-0.5",
    role: `
  text-[11px]
  font-medium
  uppercase
  tracking-wide
  text-[#1F8A8A]
`,
    avatar: `
    flex h-10 w-10
    items-center justify-center
    rounded-full
    bg-gradient-to-br
    from-[#1F8A8A]
    to-[#146666]
    font-bold text-white
    shadow-sm
    ring-2 ring-white
    ring-offset-2 ring-offset-slate-100
  `,

    chevron: "hidden text-slate-400 transition-transform duration-300 sm:block",

    dropdown: `
    absolute right-0 z-[60]
    mt-3 w-72
    overflow-hidden
    rounded-[2rem]
    border border-slate-200
    bg-white
    shadow-2xl
    animate-in fade-in zoom-in-95
    duration-200
    origin-top-right
  `,

    dropdownHeader: `
    bg-gradient-to-br
    from-[#1F8A8A]
    to-[#146666]
    p-6 text-white
  `,

    dropdownAvatar: `
    flex h-12 w-12
    shrink-0 items-center justify-center
    rounded-2xl
    bg-white/20
    text-lg font-bold
    backdrop-blur-sm
  `,

    actions: "p-3",

    item: `
    group flex w-full items-center gap-3
    rounded-2xl
    px-4 py-3
    transition-all
    hover:bg-slate-50
  `,

    itemDanger: `
    group flex w-full items-center gap-3
    rounded-2xl
    px-4 py-3
    transition-all
    hover:bg-red-50
  `,
  },
};

