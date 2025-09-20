import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
			<NavLink
				to="/register"
				className={({ isActive }) =>
					`px-3 py-2 rounded transition-colors ${
						isActive
							? "text-amber-400 font-semibold bg-gray-600"
							: "text-white hover:text-amber-400 hover:bg-gray-600"
					}`
				}>
				Logout
			</NavLink>
		</>
	);
};

const Nav = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleNavbar = () => {
		setIsOpen(!isOpen);
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
