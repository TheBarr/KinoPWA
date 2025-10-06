import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../utils/AuthContext";

const Nav = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const { isLoggedIn, username, logout } = useAuth();

	const toggleNavbar = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	const NavLinks = () => {
		return (
			<>
				{" "}
				{}
				{!isLoggedIn && (
					<>
						<NavLink
							to="/login"
							className={({ isActive }) =>
								`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border ${
									isActive
										? "text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-lg"
										: "text-gray-100 hover:text-amber-300 hover:bg-amber-400/5 border-transparent hover:border-amber-400/20"
								}`
							}>
							Login
						</NavLink>
						<NavLink
							to="/register"
							className={({ isActive }) =>
								`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border ${
									isActive
										? "text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-lg"
										: "text-gray-100 hover:text-amber-300 hover:bg-amber-400/5 border-transparent hover:border-amber-400/20"
								}`
							}>
							Register
						</NavLink>
					</>
				)}
				{isLoggedIn && (
					<>
						<span className="flex items-center justify-center px-3 py-1 text-amber-400 font-medium text-sm">
							<b>Witaj, {username}!</b>
						</span>
						<NavLink
							to="/my-bookings"
							className={({ isActive }) =>
								`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border ${
									isActive
										? "text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-lg"
										: "text-gray-100 hover:text-amber-300 hover:bg-amber-400/5 border-transparent hover:border-amber-400/20"
								}`
							}>
							Moje Bilety
						</NavLink>
						<NavLink
							to="/movies"
							className={({ isActive }) =>
								`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border ${
									isActive
										? "text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-lg"
										: "text-gray-100 hover:text-amber-300 hover:bg-amber-400/5 border-transparent hover:border-amber-400/20"
								}`
							}>
							Filmy
						</NavLink>

						<button
							onClick={handleLogout}
							className="px-4 py-2 rounded-lg font-medium text-gray-100 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-red-400/30 cursor-pointer">
							Wyloguj
						</button>
					</>
				)}
			</>
		);
	};

	return (
		<>
			<nav className="w-1/3 flex justify-end">
				<div className="hidden w-full justify-center space-x-2 md:flex">
					<NavLinks />
				</div>
				<div className="md:hidden">
					<button
						onClick={toggleNavbar}
						className="p-2 rounded-md hover:bg-white/10 transition-colors"
						aria-label="Toggle navigation menu">
						{isOpen ? (
							<X size={24} color="white" />
						) : (
							<Menu size={24} color="white" />
						)}
					</button>
				</div>
			</nav>
			{isOpen && (
				<div className="flex basis-full flex-col items-center space-y-2 py-4 md:hidden ">
					<NavLinks />
				</div>
			)}
		</>
	);
};

export default Nav;
