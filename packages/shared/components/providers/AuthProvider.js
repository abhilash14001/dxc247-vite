import { useLocation } from "react-router-dom";
import { UserAuthProvider } from "./UserAuthProvider";
import { AdminAuthProvider } from "./AdminAuthProvider";
import { useIsAdmin } from "../../hooks/useIsAdmin";

export const AuthProvider = (props) => {
    const location = useLocation();
    const isAdmin = useIsAdmin();
    // Detect if we're in admin routes
    const isAdminRoute = isAdmin;
    

    // Conditionally render the appropriate provider based on the route
    if (isAdminRoute) {
        return <AdminAuthProvider>{props.children}</AdminAuthProvider>;
    } else {
        return <UserAuthProvider>{props.children}</UserAuthProvider>;
    }
};