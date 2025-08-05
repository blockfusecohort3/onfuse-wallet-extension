// src/components/layout/Header.jsx
import { IoNotifications, IoIosArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ theme, toggleTheme }) => {
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

export default Header;
