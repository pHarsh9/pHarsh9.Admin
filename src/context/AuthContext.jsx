import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "../api/companies.api";
import { verifySession } from "../api/auth.api";
import config from "../config";



const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true for session verification
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    const [isSessionVerified, setIsSessionVerified] = useState(false);

    const navigate = useNavigate();

    // Fetch admin/user data using the session (no ID needed)
    const getAdmin = useCallback(() => {
        // const storedRole = localStorage.getItem("role");

        // // Don't fetch if no role (user is logged out)
        // if (!storedRole) {
        //     setLoading(false);
        //     setAdminData(null);
        //     return;
        // }

        setLoading(true);
        getCurrentUserDetails()
            .then((res) => {
                console.log("Admin data fetched successfully", res.data.data);
                setAdminData(res.data.data);
                // setRole(res.data.data.role);
                // localStorage.setItem("role", res.data.data.role);
            })
            .catch((error) => {
                console.log("error", error);
                // Only navigate to login if we get an auth error
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("role");
                    setAdminData(null);
                    setRole(null);
                    navigate("/");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    // Verify session on page load/refresh
    const verifyUserSession = useCallback(async () => {
        try {
            const res = await verifySession();
            console.log(res);
            if (res.data.isOk) {
                // Session is valid, update role from server
                setRole(res.data.data.role);
                localStorage.setItem("role", res.data.data.role);
                setIsSessionVerified(true);
                // Fetch full user data
                getAdmin();
            }
        } catch (error) {
            console.log("Session verification failed:", error);
            // Session is invalid, clear localStorage and redirect
            localStorage.removeItem("role");
            setAdminData(null);
            setRole(null);
            setIsSessionVerified(true);
            setLoading(false);
            navigate("/");
        }
    }, [navigate, getAdmin]);

    // Verify session on mount
    useEffect(() => {
        verifyUserSession();
    }, [verifyUserSession]);

    // Dynamic Favicon Effect
    useEffect(() => {
        if (adminData && adminData.favicon) {
            let faviconUrl = "";
            const path = adminData.favicon;
            if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
                faviconUrl = path;
            } else {
                const uploadIndex = path.indexOf("uploads/");
                if (uploadIndex !== -1) {
                    const cleanPath = path.substring(uploadIndex).replace(/\\/g, "/");
                    faviconUrl = `${config.api.API_URL}/${cleanPath}`;
                } else {
                    const cleanPath = path.replace(/^\/+/, "").replace(/\\/g, "/");
                    faviconUrl = `${config.api.API_URL}/${cleanPath}`;
                }
            }

            // Find or create favicon element
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = faviconUrl;
        } else {
            // Remove favicon element if not set
            const link = document.querySelector("link[rel~='icon']");
            if (link) {
                link.parentNode.removeChild(link);
            }
        }
    }, [adminData]);

    return (
        <AuthContext.Provider value={{ adminData, setAdminData, getAdmin, role, setRole, loading, setLoading, isSessionVerified }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

