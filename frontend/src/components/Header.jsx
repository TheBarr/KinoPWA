import Logo from "./Logo";
import Nav from "./Nav";

export const Header = () => {
	return (
		<header className="bg-dark-bckground top-0 z-[20] mx-auto flex w-full items-center justify-between border-gray-500 p-6 flex-wrap border-2">
			<Logo />
			<Nav />
		</header>
	);
};

export default Header;
