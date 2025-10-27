import { AuthContext } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as userLogout, setBalance, setExposure } from "../../store/slices/userSlice";
import { setCasinoList, setCricketList } from "../../store/slices/casinoSlice";
import { useNavigate } from "react-router-dom";
import axiosFetch, { exposureCheck } from "../../utils/Constants";
import { resetCommonDataState } from "../../store/slices/commonDataSlice";
import { store } from "../../store";

export const UserAuthProvider = (props) => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    
    // Get user data from Redux state
    const userBalance = useSelector(state => state.user.balance);
    const exposure = useSelector(state => state.user.exposure);
    const casinoList = useSelector(state => state.casino.casinoList);
    const cricketList = useSelector(state => state.casino.cricketList);
    const isLoggedIn = useSelector(state => state.user.isAuthenticated);

    // User authentication states
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState(null);
    const [bannerDetails, setBannerDetails] = useState({});
    const [showPopupAfterRedirect, setShowPopupAfterRedirect] = useState(false);

    // Function to disconnect all sockets when 401 error occurs
    const disconnectAllSockets = () => {
        try {
            // Dispatch a custom event to disconnect all sockets
            const disconnectEvent = new CustomEvent('disconnectAllSockets');
            window.dispatchEvent(disconnectEvent);
        } catch (error) {
            console.error('Error disconnecting sockets:', error);
        }
    };

    const unAuthorizeHandle = () => {
        // Clear Redux token and user data for regular users
        dispatch(userLogout());
        // Balance and exposure are now managed by Redux, no need to remove from localStorage
        clearIntervals();
    };

    const balanceInterval = useRef(null);
    const casinoInterval = useRef();
    const cricketInterval = useRef();

    const clearIntervals = (func = null) => {
        // Token and user data are now managed by Redux, no need to remove from localStorage
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
                        // Dispatch to Redux for balance and exposure
                        dispatch(setBalance(res.data.balance));
                        dispatch(setExposure(res.data.exposure));

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
                    if (response && response.data) {
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
    }, []); // Removed exposure from dependencies to prevent infinite loop

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
                dispatch(setCricketList(res.data));
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
                dispatch(setCasinoList(res.data));

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
            
            dispatch(setBalance(0));
            dispatch(setExposure(0));
            dispatch(setCasinoList([]));
            dispatch(setCricketList([]));
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
            cricketList,
            setACCESS_TOKEN,
            isLoggedIn,
            bannerDetails,
            clearIntervals,
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
