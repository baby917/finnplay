import React, { useState } from "react";
import "./styles.scss";
interface TextInputProps {
  label: string;
  type: "text" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasValue: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type,
  value,
  onChange,
  hasValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const shouldFloatLabel = isFocused || hasValue;

  return (
    <div className={`input-container ${shouldFloatLabel ? "floating" : ""}`}>
      <label className="input-label">{label}</label>

      <div className="input-wrapper">
        <input
          className="text-input"
          type={type === "password" && !showPassword ? "password" : "text"}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {type === "password" && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i
            className={`iconfont ${
              showPassword ? "icon-browse" : "icon-eye-close"
            }`}
          />
        </button>
      )}
    </div>
  );
};

export default TextInput;
