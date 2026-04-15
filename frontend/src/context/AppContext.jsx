import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser as loginRequest, logoutUser as logoutRequest, signupUser as signupRequest } from "../services/api";

const AppContext= createContext();

export const AppProvider= ({children})=>{
    const [user, setUser]= useState(null);
    const [analysis, setAnalysis]= useState(null);
    const [userLoading, setUserLoading] = useState(true);

    const normalizeUser = (backendUser) => {
        if (!backendUser) return null;

        return {
            ...backendUser,
            name: backendUser.name || backendUser.email?.split("@")[0] || "User",
        };
    };

    const refreshUser = async () => {
        try {
            const { data } = await getCurrentUser();
            setUser(normalizeUser(data.user));
            return data.user;
        } catch (error) {
            setUser(null);
            return null;
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                await refreshUser();
            } finally {
                setUserLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (payload) => {
        const { data } = await loginRequest(payload);
        setUser(normalizeUser(data.user));
        return data.user;
    };

    const signup = async (payload) => {
        const { data } = await signupRequest(payload);
        setUser(normalizeUser(data.user));
        return data.user;
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    };

    return (
        <AppContext.Provider value={{user, analysis, setAnalysis, userLoading, login, signup, logout, refreshUser}}>
            {children}
        </AppContext.Provider>
    );
};

export const  useApp= ()=> useContext(AppContext);
