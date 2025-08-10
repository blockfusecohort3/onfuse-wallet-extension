import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';



const Session = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const activityTimer = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('loggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);

        if (loggedInStatus) {
            activityTimer.current = setTimeout(() => {
                localStorage.setItem('loggedIn', 'false');
                setIsLoggedIn(false);
                navigate('/login')
                console.log("loggedStat", localStorage.getItem('loggedIn'))
            }, 1000);
        }

        return () => {
            if (activityTimer.current) clearTimeout(activityTimer.current);
        };
    }, [isLoggedIn,navigate]);

    return <>{children}</>;
};

export default Session;
