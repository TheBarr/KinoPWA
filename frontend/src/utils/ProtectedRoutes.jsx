import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
	const [isAuthorized, setIsAuthorized] = useState(null);

	useEffect(() => {
		auth().catch(() => setIsAuthorized(false));
	}, []);

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem("refreshToken");
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/token/refresh/`,
				{
					refresh: refreshToken,
				}
			);
			if (res.status === 200) {
				localStorage.setItem("accessToken", res.data.access);
				setIsAuthorized(true);
			} else {
				setIsAuthorized(false);
			}
		} catch (error) {
			console.log(error);
			setIsAuthorized(false);
		}
	};

	const auth = async () => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			setIsAuthorized(false);
			return;
		}

		try {
			const decoded = jwtDecode(token);
			const tokenExpiration = decoded.exp;
			const now = Date.now() / 1000;

			if (tokenExpiration < now) {
				await refreshToken();
			} else {
				setIsAuthorized(true);
			}
		} catch (error) {
			console.log("Token decode error:", error);
			setIsAuthorized(false);
		}
	};

	if (isAuthorized === null) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
