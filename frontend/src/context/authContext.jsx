import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axios"; // Assuming axiosInstance is configured

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const res = await axiosInstance().get("/auth/check");
                    setUser(res.data.user);
                } catch (err) {
                    console.error("Auth check failed", err);
                    logout();
                }
            }
            setCheckingAuth(false);
        };

        checkAuth();
    }, [token]);

    const login = async (credentials) => {
        try {
            const res = await axiosInstance(false).post("/auth/login", credentials);
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            setUser(user);
            navigate('/dashboard');
        } catch (err) {
            setError("Login failed. Please check your credentials.");
            console.error(err);
        }
    };

    const signup = async (signupData) => {
        try {
            const res = await axiosInstance(false).post("/auth/register", signupData);
            navigate('/login');
        } catch (err) {
            setError("Signup failed. Please try again later.");
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, checkingAuth, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
