import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


//This function is used to check if the user is authenticated or not and stops the user from accessing the dashboard if not authenticated by a token
const authentication = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const token = localStorage.getItem('token');

        useEffect(() => {
            if (!token) {
                navigate('/login');
            }
        }, [navigate, token]);

        return token ? <WrappedComponent {...props} /> : null;
    };
};

export default authentication;