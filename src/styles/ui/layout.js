import { uiTheme } from "./uiTheme";

export const layout = {
  page: uiTheme.spacing.page,
  section: uiTheme.spacing.section,
  block: uiTheme.spacing.block,
  gap: uiTheme.spacing.gap,

  header: {
    container:
      "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
    description: "text-sm text-[#64748b] mt-1",
  },

  iconBox:
    "flex items-center justify-center rounded-2xl bg-[#f0f9f6]",

  primaryIcon: "text-[#0e6b62]",
};