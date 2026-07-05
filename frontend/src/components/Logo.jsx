import { Link } from "react-router-dom";

const Logo = () => {
	return (
		<Link to="/" className="inline-block">
			<img
				className="w-30 h-30 ml-0 sm:ml-8 md:ml-15 hover:scale-110 hover:rotate-1 hover:drop-shadow-xl transition-all duration-300 filter hover:brightness-125 cursor-pointer"
				src="/assets/images/logo.png"
				alt="Cinema Logo"
				loading="eager"
			/>
		</Link>
	);
};
export default Logo;
