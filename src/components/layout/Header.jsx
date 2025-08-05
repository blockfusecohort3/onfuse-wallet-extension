// src/components/layout/Header.jsx
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io"; // Changed from io5 to io
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";


const Header = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`flex items-center ${theme.isDark ? "bg-primary-950" : "bg-gray-100"} px-7 py-2`}>
      {location.pathname !== "/" && (
        <button onClick={() => navigate(-1)} className="bg-[#5865F2] p-1 rounded-xl">
          <IoIosArrowBack className="text-primary-400 text-xl" />
        </button>
      )}
      <div className="flex-grow"></div>
      <IoNotifications className="text-[#5865F2] h-6 w-6 cursor-pointer" />
    </div>
  );
};

Header.propTypes = {
    theme: PropTypes.object.isRequired,
  };
  

export default Header;

