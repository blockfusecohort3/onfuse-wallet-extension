// src/App.jsx
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { WalletProvider } from "./contexts/WalletContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";

// Pages
import Landing from "./pages/auth/Landing";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import CreatePassword from "./pages/auth/CreatePassword";
import ImportWallet from "./pages/auth/ImportWallet";
import SecretRecovery from "./pages/auth/SecretRecovery";
import RecoveryGuess from "./pages/auth/RecoveryGuess";

import Home from "./components/wallet/Home";
import Send from "./components/wallet/Send";
import Receive from "./components/wallet/Receive";
import Transactions from "./components/wallet/Transactions";

import Profile from "./pages/profile/Profile";
import ShowPhrase from "./pages/profile/ShowPhrase";
import ViewKey from "./pages/profile/ViewKey";
import PropTypes from 'prop-types';

import "./App.css";


AppRoutes.propTypes = {
  theme: PropTypes.shape({
    isDark: PropTypes.bool.isRequired,
  }).isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

function AppRoutes({ theme, toggleTheme }) {

  const location = useLocation();
  const showNavbar = !["/", "/login", "/signup", "/create-password", "/secret-recovery", "/recovery-guess", "/import-wallet"].includes(location.pathname);

  return (
    <ErrorBoundary>
      <div className={`w-[350px] h-[600px] overflow-hidden ${theme.isDark ? "bg-primary-950" : "bg-gray-100"}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/import-wallet" element={<ImportWallet />} />
          <Route path="/secret-recovery" element={<SecretRecovery />} />
          <Route path="/recovery-guess" element={<RecoveryGuess />} />
          
          <Route path="/send-receive" element={<Home />} />
          <Route path="/send-token" element={<Send />} />
          <Route path="/receive-token" element={<Receive />} />
          <Route path="/transactions" element={<Transactions />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/seed-phrase" element={<ShowPhrase />} />
          <Route path="/private-key" element={<ViewKey />} />
        </Routes>
        {showNavbar && <Navbar />}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  const [theme, setTheme] = useState({ isDark: true });

  const toggleTheme = () => {
    setTheme(prev => ({ isDark: !prev.isDark }));
  };

  useEffect(() => {
    document.body.classList.toggle("light", !theme.isDark);
  }, [theme.isDark]);

  return (
    <WalletProvider>
      <Router>
        <AppRoutes theme={theme} toggleTheme={toggleTheme} />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </WalletProvider>
  );
}

export default App;
