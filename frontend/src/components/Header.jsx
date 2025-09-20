import Logo from "./Logo";
import Nav from "./Nav";

const Header = () => {
	return (
		<header className="sticky top-0 z-20 mx-auto flex w-full items-center justify-between bg-gray-700 p-1 flex-wrap">
			<Logo />
			<Nav />
		</header>
	);
};

export default Header;
