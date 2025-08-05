
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";


const Header = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`flex items-center ${theme.isDark ? "bg-primary-950" : "bg-white border-b border-gray-200"} px-7 py-3`}>
      {location.pathname !== "/" && (
        <button onClick={() => navigate(-1)} className="bg-primary-500 hover:bg-primary-600 p-2 rounded-xl transition-colors">
          <IoIosArrowBack className="text-white text-xl" />
        </button>
      )}
      <div className="flex-grow"></div>
      <IoNotifications className="text-primary-500 hover:text-primary-600 h-6 w-6 cursor-pointer transition-colors" />
    </div>
  );
};

Header.propTypes = {
    theme: PropTypes.object.isRequired,
  };
  

export default Header;

