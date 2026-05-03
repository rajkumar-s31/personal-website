import { createContext, useContext, useEffect, useState } from "react";
import {
    connectCloudStorage,
    getUserInfo,
    isCloudConfigured,
} from "../services/budgetCloudStorage";

const AUTH_USER_KEY = "personal-budget-user-v1";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(AUTH_USER_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.email) {
                    setUser(parsed);
                }
            }
        } catch {
            // ignore parse errors
        }

        setIsAuthLoading(false);
    }, []);

    async function login() {
        if (!isCloudConfigured()) {
            return { success: false, warning: "Google Client ID is not configured." };
        }

        const result = await connectCloudStorage();

        if (result.warning) {
            return { success: false, warning: result.warning };
        }

        const userInfo = await getUserInfo();

        if (userInfo && userInfo.email) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userInfo));
            setUser(userInfo);
            return { success: true };
        }

        const fallbackUser = {
            name: "Google User",
            email: "cloud-user",
            picture: "",
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return { success: true };
    }

    function logout() {
        localStorage.removeItem(AUTH_USER_KEY);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
