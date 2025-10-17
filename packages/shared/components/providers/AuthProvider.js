import { useLocation } from "react-router-dom";
import { ADMIN_BASE_PATH } from "../../utils/Constants";
import { UserAuthProvider } from "./UserAuthProvider";
import { AdminAuthProvider } from "./AdminAuthProvider";


export const AuthProvider = (props) => {
    const location = useLocation();
    
    // Detect if we're in admin routes
    const isAdminRoute = location.pathname.toLowerCase().startsWith(ADMIN_BASE_PATH);

    // Conditionally render the appropriate provider based on the route
    if (isAdminRoute) {
        return <AdminAuthProvider>{props.children}</AdminAuthProvider>;
    } else {
        return <UserAuthProvider>{props.children}</UserAuthProvider>;
    }
};