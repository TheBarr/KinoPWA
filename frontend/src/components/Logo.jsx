import { Link } from "react-router-dom";

const Logo = () => {
	return (
		<Link to="/" className="inline-block">
			<img
				className="w-35 h-35 hover:opacity-80 transition-opacity duration-200"
				src="/assets/images/logo.png"
				alt="Cinema Logo"
				loading="eager"
			/>
		</Link>
	);
};

export default Logo;
