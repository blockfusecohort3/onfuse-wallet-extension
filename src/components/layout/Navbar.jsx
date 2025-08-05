// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { IoSyncSharp, IoPerson, IoStatsChart, IoSwapVerticalSharp, IoCard } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  const navItems = [
    { icon: IoSyncSharp, text: "Transactions", path: "/transactions" },
    { icon: IoSwapVerticalSharp, text: "Exchange", path: "/exchange" },
    { icon: IoCard, text: "Send/Receive", path: "/send-receive" },
    { icon: IoStatsChart, text: "Statistics", path: "/statistics" },
    { icon: IoPerson, text: "Profile", path: "/profile" }
  ];

  return (
    <div className="navigation">
      <ul>
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`list ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <Link to={item.path}>
              <span className="icon"><item.icon /></span>
              <span className="text">{item.text}</span>
              <span className="circle"></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
