import { ui } from "../../styles/uiClasses";

export default function Input(props) {
  return (
    <input
      {...props}
      className={`
        ${ui.input.base}
        ${props.className || ""}
      `}
    />
  );
}