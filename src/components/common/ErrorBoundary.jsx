import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    return (
      <>
        <AnimatePresence>
          {this.state.hasError ? (
            <motion.div
              key="error-screen"
              className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              {/* Icon with animation */}
              <motion.div
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-red-500 mb-4"
              >
                <FaExclamationTriangle size={64} />
              </motion.div>

              {/* Error message */}
              <h2 className="text-2xl font-bold mb-2 text-red-400 drop-shadow-lg">
                Oops! Something broke 
              </h2>
              <p className="text-gray-400 mb-6 max-w-sm text-center">
                Don’t worry, it’s not your fault. Let’s try fixing it together.
              </p>

              {/* Try Again Button */}
              <motion.button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg text-white font-medium relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Try Again</span>
                <motion.div
                  className="absolute inset-0 bg-blue-400 opacity-30"
                  initial={{ scale: 0, borderRadius: "50%" }}
                  whileTap={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </motion.div>
          ) : (
            this.props.children
          )}
        </AnimatePresence>
      </>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
