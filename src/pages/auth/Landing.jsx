// src/pages/auth/Landing.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import Logo from "../../assets/images/onfuse-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleSignup = useCallback(() => {
    setClicked(true);
    navigate("/signup"); // Remove setTimeout for better performance
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center">
      <img src={Logo} alt="Onfuse logo" className="w-40 mx-auto" />
      <TypeAnimation
        sequence={["Welcome to ONFUSE", 2000, "", 500]}
        speed={60}
        repeat={Infinity}
        className="text-white text-2xl font-bold py-2 mb-4"
      />
      <div className="text-left">
        <p className="text-2xl font-bold text-white">
          Easiest and Secure Crypto Wallet
        </p>
        <p className="text-white">Securely store and manage all your crypto in one place.</p>
      </div>
      <button onClick={handleSignup} className="mt-10 bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 px-8 py-2 rounded-full">
        Let's Start
      </button>
    </div>
  );
};

export default Landing;
