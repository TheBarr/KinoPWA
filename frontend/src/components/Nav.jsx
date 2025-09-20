import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "axios";

const Nav = () => {
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false);

	const toggleNavbar = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = async () => {
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
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				console.log("Log out successful!");
				navigate("/login");
			}
		} catch (error) {
			console.error("Failed to logout", error.response?.data || error.message);
		}
	};

	const NavLinks = () => {
		return (
			<>
				<NavLink
					to="/movies"
					className={({ isActive }) =>
						`px-3 py-2 rounded transition-colors ${
							isActive
								? "text-amber-400 font-semibold bg-gray-600"
								: "text-white hover:text-amber-400 hover:bg-gray-600"
						}`
					}>
					Movies
				</NavLink>
				<NavLink
					to="/login"
					className={({ isActive }) =>
						`px-3 py-2 rounded transition-colors ${
							isActive
								? "text-amber-400 font-semibold bg-gray-600"
								: "text-white hover:text-amber-400 hover:bg-gray-600"
						}`
					}>
					Login
				</NavLink>
				<NavLink
					to="/register"
					className={({ isActive }) =>
						`px-3 py-2 rounded transition-colors ${
							isActive
								? "text-amber-400 font-semibold bg-gray-600"
								: "text-white hover:text-amber-400 hover:bg-gray-600"
						}`
					}>
					Register
				</NavLink>
				<button
					onClick={handleLogout}
					className="px-3 py-2 rounded transition-colors text-white hover:text-amber-400 hover:bg-gray-600 cursor-pointer">
					Logout
				</button>
			</>
		);
	};

	return (
		<>
			<nav className="w-1/3 flex justify-end">
				<div className="hidden w-full justify-around md:flex">
					<NavLinks />
				</div>
				<div className="md:hidden">
					<button onClick={toggleNavbar}>{isOpen ? <X /> : <Menu />}</button>
				</div>
			</nav>
			{isOpen && (
				<div className="flex basis-full flex-col items-center">
					<NavLinks />
				</div>
			)}
		</>
	);
};

export default Nav;
