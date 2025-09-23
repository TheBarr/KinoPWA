import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState, useEffect } from "react";

function PublicRoute({ children }) {
	const [isAuthorized, setIsAuthorized] = useState(null);

	useEffect(() => {
		auth().catch(() => setIsAuthorized(false));
	}, []);

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem("refreshToken");
		try {
			const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
				refresh: refreshToken,
			});
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

	// Jeśli zalogowany - przekieruj na dashboard/home
	// Jeśli niezalogowany - pokaż login/register
	return isAuthorized ? <Navigate to="/" /> : children;
}

export default PublicRoute;
