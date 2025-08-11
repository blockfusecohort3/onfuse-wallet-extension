import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";

const ActiveHeader = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBackClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(-1);
    }, 400);
  };

  return (
    <div className="fixed top-0 left-0 w-full flex items-center bg-gray-950 border-b border-gray-600 px-7 py-3 z-50">
      {location.pathname !== "/" && (
        <motion.button
          onClick={handleBackClick}
          initial={{ x: 0 }}
          animate={isAnimating ? { x: -25 } : { x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-primary-500 hover:bg-primary-600 p-2 rounded-xl"
        >
          <IoIosArrowBack className="text-white text-xl" />
        </motion.button>
      )}
    </div>
  );
};

ActiveHeader.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default ActiveHeader;
