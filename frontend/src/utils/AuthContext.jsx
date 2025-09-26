import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

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
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				const response = await axios.get(
					"http://127.0.0.1:8000/api/user/",
					config
				);
				setLoggedIn(true);
				setUsername(response.data.username);
			} else {
				setLoggedIn(false);
				setUsername("");
			}
		} catch (error) {
			setLoggedIn(false);
			setUsername("");
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials) => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/api/login/",
				credentials
			);

			const { tokens, user } = response.data;
			localStorage.setItem("accessToken", tokens.access);
			localStorage.setItem("refreshToken", tokens.refresh);

			setLoggedIn(true);
			checkAuthStatus();
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
			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");

			if (accessToken && refreshToken) {
				const config = {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				};
				await axios.post(
					"http://127.0.0.1:8000/api/logout/",
					{ refresh: refreshToken },
					config
				);
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
