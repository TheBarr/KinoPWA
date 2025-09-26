import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";

export default function Home() {
	const { isLoggedIn, username } = useAuth();

	return (
		<div className="text-white">
			{isLoggedIn ? (
				<>
					<h2>Hi, {username}. Thanks for loggin in!</h2>
				</>
			) : (
				<h2>Please Login</h2>
			)}
		</div>
	);
}

// const [username, setUsername] = useState("");
// const [isLoggedIn, setLoggedIn] = useState(false);

// useEffect(() => {
// 	const checkLoggedInUser = async () => {
// 		try {
// 			const token = localStorage.getItem("accessToken");
// 			if (token) {
// 				const config = {
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 					},
// 				};
// 				const response = await axios.get(
// 					"http://127.0.0.1:8000/api/user/",
// 					config
// 				);
// 				setLoggedIn(true);
// 				setUsername(response.data.username);
// 			} else {
// 				setLoggedIn(false);
// 				setUsername("");
// 			}
// 		} catch (error) {
// 			setLoggedIn(false);
// 			setUsername("");
// 		}
// 	};
// 	checkLoggedInUser();
// }, []);

// const handleLogout = async () => {
// 		try {
// 			const accessToken = localStorage.getItem("accessToken");
// 			const refreshToken = localStorage.getItem("refreshToken");

// 			if (accessToken && refreshToken) {
// 				const config = {
// 					headers: {
// 						Authorization: `Bearer ${accessToken}`,
// 					},
// 				};
// 				await axios.post(
// 					"http://127.0.0.1:8000/api/logout/",
// 					{ refresh: refreshToken },
// 					config
// 				);
// 				localStorage.removeItem("accessToken");
// 				localStorage.removeItem("refreshToken");
// 				setLoggedIn(false);
// 				setUsername("");
// 				console.log("Log out successful!");
// 				navigate("/login");
// 			}
// 		} catch (error) {
// 			console.error("Failed to logout", error.response?.data || error.message);
// 		}
// 	};
