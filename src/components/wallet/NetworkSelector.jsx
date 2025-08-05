// src/components/wallet/NetworkSelector.jsx
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegCircleDot } from "react-icons/fa6";
import { NETWORK_COLORS } from "../../constants";
import PropTypes from "prop-types";



const NetworkSelector = ({ selectedNetwork, onNetworkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const networks = [
    { name: "Ethereum", color: NETWORK_COLORS.Ethereum },
    { name: "Sepolia", color: NETWORK_COLORS.Sepolia }
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectNetwork = (network) => {
    onNetworkChange(network);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center space-x-4 rounded-full bg-purple-400 text-white w-40 py-1"
      >
        <FaRegCircleDot className="mr-2" style={{ color: selectedNetwork.color }} />
        <span>{selectedNetwork.name}</span>
        <IoIosArrowDown className="ml-2" />
      </button>

      {isDropdownOpen && (
        <ul className="absolute left-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
          {networks.map((network, index) => (
            <li
              key={index}
              onClick={() => selectNetwork(network)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              <FaRegCircleDot className="mr-2" style={{ color: network.color }} />
              <span>{network.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

NetworkSelector.propTypes = {
    selectedNetwork: PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    }).isRequired,
    onNetworkChange: PropTypes.func.isRequired
};

export default NetworkSelector;
