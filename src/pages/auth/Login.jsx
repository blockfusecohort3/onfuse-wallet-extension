import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useWallet } from "../../contexts/WalletContext";

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("At least one special character");
  return {
    isValid: errors.length === 0,
    errors
  };
};

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { strength: "Weak", color: "text-red-500" };
  if (score === 2) return { strength: "Medium", color: "text-yellow-500" };
  return { strength: "Strong", color: "text-green-500" };
};

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useWallet();

  const validation = validatePassword(password);
  const strength = getPasswordStrength(password);

  const handleLogin = async () => {
    if (!password.trim()) {
      setErrorMessage("Please enter your password");
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const success = authenticate(password);
      setTimeout(() => {
        if (success) {
          toast.success("Login successful");
          navigate("/send-receive");
        } else {
          setErrorMessage("Invalid password");
          toast.error("Invalid password");
        }
        setLoading(false);
      }, 1500);
    } catch {
      setErrorMessage("Login failed");
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-3 px-4 py-10 flex flex-col items-center bg-gray-950">
      <div className="mt-8">
        <h1 className="text-2xl mt-10 text-white">Login</h1>
      </div>

      <div className="flex flex-col space-y-8 items-center justify-center mt-28 w-full px-6 max-w-md">
        <motion.div
          key={errorMessage || "no-error"}
          animate={errorMessage ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative flex flex-col w-full"
        >
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`rounded-full px-4 text-gray-300 text-sm p-3 w-full pr-10 focus:outline-none bg-gray-500/30 transition-all duration-300
              ${errorMessage ? "border-red-500 border-2" : "border-gray-800 border-2 focus:ring-primary-500 focus:border-primary-500"}`}
            placeholder="Enter password"
          />
          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IoEyeOffOutline className="text-gray-500 hover:text-gray-600" />
            ) : (
              <IoEyeOutline className="text-gray-500 hover:text-gray-600" />
            )}
          </div>
        </motion.div>

        {password && (
          <div className="w-full space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Strength:</span>
              <span className={`text-xs font-medium ${strength.color}`}>
                {strength.strength}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  strength.strength === "Weak"
                    ? "bg-red-500 w-1/3"
                    : strength.strength === "Medium"
                    ? "bg-yellow-500 w-2/3"
                    : "bg-green-500 w-full"
                }`}
              />
            </div>
          </div>
        )}

        {isFocused && !validation.isValid && password && (
          <div className="w-full space-y-1">
            {validation.errors.map((err, idx) => (
              <p key={idx} className="text-red-500 text-xs">• {err}</p>
            ))}
          </div>
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

      <div className="space-y-4 w-full">
          <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.96 } : {}}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-800 rounded-full py-2 text-white disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
            />
          ) : (
            "Unlock"
          )}
        </motion.button>
        <span className="text-white py-2 text-center justify-center flex">OR</span>
         <Link to="/import-wallet"
         className="w-full rounded-full text-white disabled:opacity-50 flex justify-center items-center" 
         >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="border-2 border-primary-300 w-full py-2 px-4 rounded-full bg-opacity-10 text-white transition-colors"
          >
            Import an Existing Wallet
          </motion.button>
        </Link>
      </div>
      </div>
     <div className="flex items-center gap-2 pt-10">
       <span className="text-white">Don't have an account .</span>
      <Link to="/signup"
      className="text-white cursor-pointer  underline"
      >
      <span className="text-blue-300">Create Account</span>
      </Link>
     </div>
    </div>
  );
};

export default Login;
