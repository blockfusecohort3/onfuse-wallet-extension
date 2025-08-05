// src/components/forms/PasswordInput.jsx
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import PropTypes from "prop-types";

const PasswordInput = ({ value, onChange, placeholder, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-1">
      <div className="relative flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-2 border-gray-300 bg-transparent rounded-full px-4 text-primary-400 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <div
          className="absolute right-3 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <IoEyeOffOutline className="text-white" />
          ) : (
            <IoEyeOutline className="text-white" />
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default PasswordInput;
