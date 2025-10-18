import { AuthContext } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axiosFetch, { ADMIN_BASE_PATH } from "../../utils/Constants";
import { loginSuccess } from "../../store/admin/adminSlice";

export const AdminAuthProvider = (props) => {
    const nav = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    // Admin authentication states
    const [adminUser, setAdminUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState(null);

    // Function to disconnect all sockets when 401 error occurs
    const disconnectAllSockets = () => {
        try {
            // Dispatch a custom event to disconnect all sockets
            const disconnectEvent = new CustomEvent('disconnectAllSockets');
            window.dispatchEvent(disconnectEvent);
            console.log('Disconnect all sockets event dispatched for 401 error');
        } catch (error) {
            console.error('Error disconnecting sockets:', error);
        }
    };

    const unAuthorizeHandle = () => {
        // Token is now managed by Redux, no need to remove from localStorage
        localStorage.removeItem('admin_exposure');
        clearIntervals();
    };

    const balanceInterval = useRef(null);

    const clearIntervals = (func = null) => {
        // Token and user data are now managed by Redux, no need to remove from localStorage
        localStorage.removeItem('admin_isLoggedIn');

        clearInterval(balanceInterval.current);

        if (func != null) {
            return nav('/login');
        }
    };

    const getBalance = () => {
        // Admin doesn't need balance fetching
        return Promise.resolve(null);
    };

    const login = (userData, token) => {
        try {
            // Token and user data are now managed by Redux, no need to store in localStorage
            localStorage.setItem('admin_isLoggedIn', true);
            setAdminUser(userData);
            setIsAuthenticated(true);
            setACCESS_TOKEN(token);
            dispatch(loginSuccess({user: userData, token: token}));
            
            nav('/');
        } catch (error) {
            console.error('Error saving admin login data:', error);
            throw error;
        }
    };

    const logout = () => {
        try {
            // Admin logout logic can be added here if needed
            // For now, we'll rely on Redux state management
            clearIntervals();
        } catch (error) {
            console.error('Error during admin logout:', error);
        }
    };

    const updateAdminUser = (userData) => {
        try {
            localStorage.setItem('admin_user', JSON.stringify(userData));
            setAdminUser(userData);
        } catch (error) {
            console.error('Error updating admin user data:', error);
        }
    };

    // Manage frontend CSS based on admin routes
    // useEffect(() => {
    //     const isAdminCasinoRoute = location.pathname.startsWith('/casino/');
        
    //     if ((location.pathname.startsWith('/admin') || location.pathname.startsWith('/login') || location.pathname.startsWith('/change-password') || location.pathname.startsWith('/transaction-password') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/users') || location.pathname.startsWith('/casinos') || location.pathname.startsWith('/reports') || location.pathname.startsWith('/settings')) && !isAdminCasinoRoute) {
    //         // Remove CSS for regular admin routes
    //         const links = document.querySelectorAll(
    //             'link[href*="/assets/css/style.css"], link[href*="/assets/css/admin/style.css"], link[href*="/assets/css/responsive.css"], link[href*="/assets/css/custom.css"], link[href*="/assets/css/theme.css"], link[href*="bootstrap.min.css"]'
    //         );
    //         links.forEach((link) => link.remove());
    //     } else if (isAdminCasinoRoute) {
    //         // Add CSS back for admin casino routes
    //         const cssFiles = [
    //             '/assets/css/admin/style.css',
    //             '/assets/css/responsive.css', 
    //             '/assets/css/custom.css',
    //             '/assets/css/theme.css',
    //             'bootstrap.min.css'
    //         ];

    //         cssFiles.forEach(href => {
    //             // Check if CSS is already loaded
    //             const existingLink = document.querySelector(`link[href*="${href}"]`);
    //             if (!existingLink) {
    //                 const link = document.createElement('link');
    //                 link.rel = 'stylesheet';

    //                 link.href = href.includes('bootstrap') ? `https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/${href}` : href;
    //                 document.head.appendChild(link);
    //             }
    //         });
    //     }
    // }, [location.pathname]);

    return (
        <AuthContext.Provider value={{
            // Admin-specific values
            adminUser,
            isAuthenticated,
            loading,
            login,
            logout,
            updateAdminUser,
            isAdminRoute: true,
            
            // User-specific values (set to null/false for admin context)
            ACCESS_TOKEN,
            showPopupAfterRedirect: false,
            setShowPopupAfterRedirect: () => {},
            userBalance: 0,
            exposure: 0,
            casinoList: [],
            setUserBalance: () => {},
            cricketList: [],
            setACCESS_TOKEN: () => {},
            isLoggedIn: false,
            setIsLoggedIn: () => {},
            bannerDetails: {},
            clearIntervals,
            setCricketList: () => {},
            unAuthorizeHandle,
            getCasinoList: () => {},
            getCricketList: () => {},
            getBalance
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};
