import { AuthContext } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logout as userLogout } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import axiosFetch, { exposureCheck } from "../../utils/Constants";
import { resetCommonDataState } from "../../store/slices/commonDataSlice";
import { store } from "../../store";

export const UserAuthProvider = (props) => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    // User authentication states
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState(null);
    const [userBalance, setUserBalance] = useState(localStorage.getItem('balance') ?? 0);
    const [exposure, setExposure] = useState(exposureCheck() ?? 0);
    const [casinoList, setCasinoList] = useState(JSON.parse(localStorage.getItem('casinoList')) ?? []);
    const [cricketList, setCricketList] = useState(JSON.parse(localStorage.getItem('cricketList')) ?? []);
    const [bannerDetails, setBannerDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') ?? false);
    const [showPopupAfterRedirect, setShowPopupAfterRedirect] = useState(false);

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
        // Clear Redux token and user data for regular users
        dispatch(userLogout());
        // Token is now managed by Redux, no need to remove from localStorage
        localStorage.removeItem('exposure');
        clearIntervals();
    };

    const balanceInterval = useRef(null);
    const casinoInterval = useRef();
    const cricketInterval = useRef();

    const clearIntervals = (func = null) => {
        // Token and user data are now managed by Redux, no need to remove from localStorage
        localStorage.removeItem('isLoggedIn');

        clearInterval(balanceInterval.current);

        if (func != null) {
            return nav('/login');
        }
    };

    const getBalance = () => {
        try {
            const token = store.getState().user.token;
            if (token !== null) {
                return axiosFetch('user_balance', 'get')
                    .then((res) => {
                        setUserBalance(res.data.balance);
                        setExposure(res.data.exposure);
                        
                        localStorage.setItem('balance', res.data.balance);
                        localStorage.setItem('exposure', res.data.exposure);

                        return res; // Return the response
                    })
                    .catch((error) => {
                        if (error.code === 'ERR_NETWORK' || error.response.status === 401) {
                            unAuthorizeHandle();
                            nav('/login');
                            clearInterval(balanceInterval.current);
                            // Disconnect all sockets on 401 error
                            disconnectAllSockets();
                        }
                        throw error; // Re-throw the error so it can be caught by the caller
                    });
            }
            return Promise.resolve(null); // Return a resolved promise if no token
        }
        catch(e){
            return Promise.reject(e); // Return a rejected promise on error
        }
    };

    useEffect(() => {
        getBalance();
        if (balanceInterval.current == null) {
            balanceInterval.current = setInterval(async () => {
                try {
                    const response = await getBalance();
                    
                    if (response && response.status === 200) {
                        // Continue to next interval on success
                        return;
                    } else {
                        // Stop interval if status is not 200
                        clearInterval(balanceInterval.current);
                        balanceInterval.current = null;
                    }
                } catch (error) {
                    // Stop interval on error
                    clearInterval(balanceInterval.current);
                    balanceInterval.current = null;
                }
            }, 2000);
        }
        return () => {
            clearInterval(balanceInterval.current);
            balanceInterval.current = null;
        };
    }, [ACCESS_TOKEN]); // Removed exposure from dependencies to prevent infinite loop

    useEffect(() => {
        if(showPopupAfterRedirect){
            getBannerDetails();
        }
    }, [showPopupAfterRedirect]);

    const getCricketList = (token) => {
        try {
            axiosFetch("cricket_list", 'get').then((res) => {
                if (typeof cricketInterval === 'undefined') {
                    cricketInterval.current = setInterval(() => getCricketList(token), 5000);
                }
                setCricketList(res.data);
                localStorage.setItem('cricketList', JSON.stringify(res.data));
            }).catch((error) => {
                if (error.code === 'ERR_NETWORK') {
                    clearInterval(casinoInterval.current);
                    clearInterval(cricketInterval.current);

                    unAuthorizeHandle();
                    // Disconnect all sockets on network error
                    disconnectAllSockets();

                    return nav('/login');
                }
            });
        } catch (e) {
            // Handle error silently
        }
    };

    const getBannerDetails = async () => {
     
        await axiosFetch('banner_details', 'get', setBannerDetails);
    };

    const getCasinoList = (token) => {
        try {
            axiosFetch("getCasinoList", 'get').then((res) => {
                setCasinoList(res.data);
                localStorage.setItem('casinoList', JSON.stringify(res.data));

                if (typeof casinoInterval === 'undefined') {
                    casinoInterval.current = setInterval(() => getCasinoList(token), 5000);
                }
            }).catch((error) => {
                if (error.code === 'ERR_NETWORK') {
                    // Clear intervals when an error occurs
                    clearInterval(casinoInterval.current);
                    clearInterval(cricketInterval.current);

                    unAuthorizeHandle();
                    // Disconnect all sockets on network error
                    disconnectAllSockets();
                    return nav('/login');
                }
            });
        } catch (e) {
            // Handle error silently
        }
    };

    const logout = () => {
        try {
            axiosFetch('logout', 'post');

            // Regular user logout - clear common data
            dispatch(resetCommonDataState());
            // Clear Redux token and user data
            
            dispatch(userLogout());

            
            // Clear remaining localStorage items
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('balance');
            localStorage.removeItem('exposure');
            localStorage.removeItem('casinoList');
            localStorage.removeItem('cricketList');
            
            setIsLoggedIn(false);
            setUserBalance(0);
            setExposure(0);
            setCasinoList([]);
            setCricketList([]);
            clearIntervals();
            nav('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            // User-specific values
            ACCESS_TOKEN,
            showPopupAfterRedirect,
            setShowPopupAfterRedirect,
            userBalance,
            exposure,
            casinoList,
            setUserBalance,
            cricketList,
            setACCESS_TOKEN,
            isLoggedIn,
            setIsLoggedIn,
            bannerDetails,
            clearIntervals,
            setCricketList,
            unAuthorizeHandle,
            getCasinoList,
            getCricketList,
            getBalance,
            logout,
            
            // Admin-specific values (set to null/false for user context)
            adminUser: null,
            isAuthenticated: false,
            loading: false,
            login: null,
            updateAdminUser: null,
            isAdminRoute: false
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};
