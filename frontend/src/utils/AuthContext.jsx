import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import apiClient from "../utils/axiosConfig";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(true);

	const checkAuthStatus = async () => {
		try {
			const token = localStorage.getItem("accessToken");

			if (token) {
				if (navigator.onLine) {
					const response = await apiClient.get("/user/");
					setLoggedIn(true);
					setUsername(response.data.username);
				} else {
					const savedUsername = localStorage.getItem("username");
					setLoggedIn(true);
					setUsername(savedUsername || "Użytkownik");
				}
			} else {
				setLoggedIn(false);
				setUsername("");
			}
		} catch  {
			const token = localStorage.getItem("accessToken");
			if (token) {
				const savedUsername = localStorage.getItem("username");
				setLoggedIn(true);
				setUsername(savedUsername || "Użytkownik");
			} else {
				setLoggedIn(false);
				setUsername("");
			}
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "/login/",
				credentials
			);

			const { tokens } = response.data;
			localStorage.setItem("accessToken", tokens.access);
			localStorage.setItem("refreshToken", tokens.refresh);

			setLoggedIn(true);

			const userResponse = await apiClient.get("/user/");
			const username = userResponse.data.username;
			setUsername(username);
			localStorage.setItem("username", username);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error,
			};
		}
	};

	const logout = async () => {
		try {
			const refreshToken = localStorage.getItem("refreshToken");

			if (refreshToken) {
				await apiClient.post("/logout/", { refresh: refreshToken });
			}
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			setLoggedIn(false);
			setUsername("");
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const value = {
		isLoggedIn,
		username,
		loading,
		login,
		logout,
		checkAuthStatus,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
