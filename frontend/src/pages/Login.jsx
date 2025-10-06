import React, { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isLoading) {
			return;
		}

		setIsLoading(true);

		try {
			const result = await login(formData);

			if (result.success) {
				console.log("Success!");
				setSuccessMessage("Login Successful!");
				setError(null);
				navigate("/");
			} else {
				throw result.error;
			}
		} catch (error) {
			console.log("Error during Login!", error.response?.data);
			if (error.response && error.response.data) {
				Object.keys(error.response.data).forEach((field) => {
					const errorMessages = error.response.data[field];
					if (errorMessages && errorMessages.length > 0) {
						setError(errorMessages[0]);
					}
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-start pt-20">
			<div className="w-96 p-6 shadow-lg bg-white rounded-md">
				<div className="flex justify-center font-bold mb-4">
					{error && <p className="text-red-500">{error}</p>}
					{successMessage && <p className="text-green-500">{successMessage}</p>}
				</div>

				<h1 className="text-3xl flex items-center justify-center gap-2 font-semibold">
					<User className="w-8 h-8" />
					Login
				</h1>
				<hr className="mt-3" />
				<form onSubmit={handleSubmit}>
					<div className="mt-3">
						<label htmlFor="email" className="block text-base mb-2">
							Email
						</label>
						<input
							className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
							type="email"
							name="email"
							id="email"
							placeholder="Enter email..."
							value={formData.email}
							onChange={handleChange}></input>
					</div>
					<div className="mt-3">
						<label htmlFor="password" className="block text-base mb-2">
							Password
						</label>
						<input
							className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
							type="password"
							name="password"
							id="password"
							placeholder="Enter password..."
							value={formData.password}
							onChange={handleChange}></input>
					</div>
					<div className="mt-5">
						<button
							disabled={isLoading}
							onClick={handleSubmit}
							type="submit"
							className="border-2 border-amber-400 bg-amber-400 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-amber-400 font-semibold cursor-pointer">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
