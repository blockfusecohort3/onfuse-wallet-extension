import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Logo from "../../assets/images/onfuse-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleSignup = useCallback(() => {
    setClicked(true);

    setTimeout(() => {
      navigate("/signup");
    }, 500); 
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center h-full items-center py-8 bg-gray-950">
      <div className="text-center">
        <div className="flex items-center">
          <img src={Logo} alt="Onfuse logo" className="w-40 mx-auto" />
        </div>
        <div className="py-2 mb-4 text-center">
          <TypeAnimation
            sequence={["Welcome to ONFUSE", 2000, "", 500]}
            speed={60}
            repeat={Infinity}
            wrapper="div"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
            className="text-2xl text-white md:text-3xl font-bold"
          />
        </div>

        <div className="text-white mx-4">
          <div className="text-left py-4">
            <p className="text-xl font-bold max-w-xl pt-2 mt-4 break-words text-center">
              Easy and Secure Crypto Wallet
            </p>

            <p className="text-center mx-4">
              Securely store and manage all your crypto in one place.
            </p>
          </div>

          <div className="space-y-5 justify-center  mt-10">
            <div className="flex items-center justify-center">
              <button
                onClick={handleSignup}
                disabled={clicked}
                className="relative overflow-hidden rounded-full w-[250px] bg-gradient-to-r from-primary-500 to-primary-800 text-white pr-8 flex items-center justify-start gap-6 group"
              >
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: clicked ? 170 : 0 }}
                  whileHover={{
                    x: clicked ? 180 : 12,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 15,
                  }}
                  className="bg-white p-4 m-[2px] rounded-full z-20"
                >
                  <ArrowRight className="text-xl text-gray-400" />
                </motion.div>

                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: clicked ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="z-10 text-xl"
                >
                  Let&#39;s Start
                </motion.span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
