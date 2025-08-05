import PropTypes from 'prop-types';

Button.propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool,
    className: PropTypes.string,
  };
  
const Button = ({ children, loading, className, ...props }) => {
    return (
      <button
        className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  };
  
  export default Button;
  