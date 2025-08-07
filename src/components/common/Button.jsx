import PropTypes from 'prop-types';



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

  Button.propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool,
    className: PropTypes.string,
  };
  
  export default Button;