import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegCircleDot } from "react-icons/fa6";
import { NETWORK_COLORS } from "../../constants";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";

const NetworkSelector = ({ selectedNetwork, onNetworkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const networks = [
    { name: "Ethereum", color: NETWORK_COLORS.Ethereum },
    { name: "Sepolia", color: NETWORK_COLORS.Sepolia },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const selectNetwork = (network) => {
    onNetworkChange(network);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center mt-3">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center space-x-3 rounded-full bg-primary-500 hover:bg-primary-800 text-white w-44 py-2 px-4 shadow-lg transition-all duration-300 ease-in-out"
      >
        <FaRegCircleDot style={{ color: selectedNetwork.color }} />
        <span className="font-medium">{selectedNetwork.name}</span>
        <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.ul
            key="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute mt-14 w-44 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-xl z-50"
          >
            {networks.map((network, index) => (
              <li
                key={index}
                onClick={() => selectNetwork(network)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-white/20 hover:scale-[1.02] transition-all duration-200 rounded-md"
              >
                <FaRegCircleDot className="mr-2" style={{ color: network.color }} />
                <span className="font-medium">{network.name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

NetworkSelector.propTypes = {
  selectedNetwork: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  onNetworkChange: PropTypes.func.isRequired,
};

export default NetworkSelector;
