import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.user.token !== null);
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);
    
    if (!isLoggedIn) {
        return null; // or a loading component
    }
    
    return children;
};

export default ProtectedRoute;