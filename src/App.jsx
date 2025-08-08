import { HashRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

import { WalletProvider, useWallet } from "./contexts/WalletContext";
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

import Profile from "./pages/Profile/Profile";
import ShowPhrase from "./pages/Profile/ShowPhrase";
import ViewKey from "./pages/Profile/ViewKey";
// import { checkPropTypes } from "prop-types";

import "./App.css";

const AuthGuard = ({ children }) => {
  const { loading, accounts, isAuthenticated } = useWallet();
  const location = useLocation();
  
  if (loading) return <div>Loading...</div>;
  
  const authRoutes = ["/", "/login", "/signup", "/create-password", "/secret-recovery", "/recovery-guess", "/import-wallet"];
  const isAuthRoute = authRoutes.includes(location.pathname);
  
  // If wallet exists but not authenticated, redirect to login
  if (accounts.length > 0 && !isAuthenticated && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }
  
  // If no wallet exists and not on auth route, redirect to landing
  if (accounts.length === 0 && !isAuthRoute) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and on login/landing, redirect to wallet
  if (isAuthenticated && (location.pathname === "/" || location.pathname === "/login")) {
    return <Navigate to="/send-receive" replace />;
  }
  
  return children;
};



function AppRoutes({ theme, toggleTheme }) {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/signup", "/create-password", "/secret-recovery", "/recovery-guess", "/import-wallet"].includes(location.pathname);
  const showHeader = !["/", "/login", "/signup", "/create-password", "/secret-recovery", "/recovery-guess", "/import-wallet"].includes(location.pathname);

  return (
    <ErrorBoundary>
      <div className={`w-[350px] h-[600px] overflow-hidden ${theme.isDark ? "bg-primary-950" : "bg-white"}`}>

        {showHeader && <Header theme={theme} toggleTheme={toggleTheme} />}
                <AuthGuard>
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
        </AuthGuard>
        {showNavbar && <Navbar />}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  const [theme, setTheme] = useState({ isDark: false });

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


AppRoutes.propTypes = {
  theme: PropTypes.shape({
    isDark: PropTypes.bool.isRequired,
  }).isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
