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

  text: uiTheme.typography,

  card,
  cardCompact,

  button,
  badge,
  table,
  filters,
  alert,
  pagination,
  form,
  input,
  modal,
  headerBar,
  userMenu,
};