import { uiTheme } from "./uiTheme";
import { layout } from "./layout";
import { card, cardCompact } from "./cards";
import { button } from "./buttons";
import { badge } from "./badges";
import { table } from "./tables";
import { filters } from "./filters";
import { alert } from "./alerts";
import { pagination } from "./pagination";
import { form, input } from "./forms";
import { modal } from "./modals";
import { headerBar } from "./headerBar";
import { userMenu } from "./userMenu";

export const ui = {
  ...layout,
  //verificado
  text: {
    ...uiTheme.typography,
    label: `text-xs font-semibold uppercase tracking-wider text-slate-400`,
  },
  //verificado
  header: {
    container: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
    description: "text-sm text-[#64748b] mt-1",
  },
  //verificado
  iconBox: `flex items-center justify-center rounded-2xl bg-[#f0f9f6]`,
  //verificado
  page: uiTheme.spacing.page,
  //verificado
  primaryIcon: "text-[#0e6b62]",
  //verificado
  card,
  cardCompact,
  //verificado
  button,
  //verificado
  badge,
  //verificado
  table,
  //verificado
  filters,
  //verificado
  alert,
  //veridicado
  pagination,
  //verificado
  form,
  input,
  ////verificado
  modal,
  headerBar,
  userMenu,
};
