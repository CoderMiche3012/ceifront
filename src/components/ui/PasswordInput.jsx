import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Input from "./Input";

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "••••••••",
  disabled = false,
  required = false,
  autoComplete = "new-password",
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      {/* label */}
      <label className="block text-[13px] font-bold uppercase tracking-wide text-slate-500">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>

      <div className="relative">
        <Input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          error={error}
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {show ? (
            <HiOutlineEyeOff size={20} />
          ) : (
            <HiOutlineEye size={20} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-rose-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}