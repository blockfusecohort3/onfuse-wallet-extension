// src/components/forms/PasswordInput.jsx
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { validatePassword, getPasswordStrength } from "../../utils/validation/passwordValidation";
import PropTypes from "prop-types";

const PasswordInput = ({ value, onChange, placeholder, error, showValidation = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const validation = validatePassword(value);
  const strength = getPasswordStrength(value);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-2">
      <div className="relative flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

      {/* Password Strength Indicator */}
      {showValidation && value && (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Strength:</span>
            <span className={`text-xs font-medium ${strength.color}`}>
              {strength.strength}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                strength.strength === 'Weak' ? 'bg-red-500 w-1/3' :
                strength.strength === 'Medium' ? 'bg-yellow-500 w-2/3' :
                'bg-green-500 w-full'
              }`}
            />
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {showValidation && isFocused && !validation.isValid && (
        <div className="space-y-1">
          {validation.errors.map((err, index) => (
            <p key={index} className="text-red-500 text-xs">• {err}</p>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string,
  showValidation: PropTypes.bool,
};

export default PasswordInput;
