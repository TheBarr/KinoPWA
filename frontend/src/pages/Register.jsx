import React, { useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

export default function Register() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password1: "",
		password2: "",
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
		setError(null);
		console.log(e.data);
		e.preventDefault();
		if (isLoading) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/api/register/",
				formData
			);
			console.log("Success!", response.data);
			setError(null);
			setSuccessMessage("Registration Successful!");
		} catch (error) {
			console.log("Error during registration!", error.response?.data);
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
					Register
				</h1>
				<hr className="mt-3" />
				<form onSubmit={handleSubmit}>
					<div className="mt-3">
						<label htmlFor="username" className="block text-base mb-2">
							Username
						</label>
						<input
							className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
							type="text"
							name="username"
							id="username"
							placeholder="Enter username..."
							value={formData.username}
							onChange={handleChange}></input>
					</div>
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
						<label htmlFor="password1" className="block text-base mb-2">
							Password
						</label>
						<input
							className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
							type="password"
							name="password1"
							id="password1"
							placeholder="Enter password..."
							value={formData.password1}
							onChange={handleChange}></input>
					</div>
					<div className="mt-3">
						<label htmlFor="password2" className="block text-base mb-2">
							Repeat Password
						</label>
						<input
							className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
							type="password"
							name="password2"
							id="password2"
							placeholder="Repeat password..."
							value={formData.password2}
							onChange={handleChange}></input>
					</div>
					<div className="mt-5">
						<button
							disabled={isLoading}
							onClick={handleSubmit}
							type="submit"
							className="border-2 border-amber-400 bg-amber-400 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-amber-400 font-semibold cursor-pointer">
							Register
						</button>
					</div>
				</form>
			</div>
		</div>

		// <div>
		// 	{error && <p style={{ color: "red" }}>{error}</p>}
		// 	{successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
		// 	<h2>Register:</h2>
		// 	<form>
		// 		<label>username:</label>
		// 		<br />
		// 		<input
		// 			type="text"
		// 			name="username"
		// 			value={formData.username}
		// 			onChange={handleChange}></input>{" "}
		// 		<br />
		// 		<br />
		// 		<label>email:</label>
		// 		<br />
		// 		<input
		// 			type="email"
		// 			name="email"
		// 			value={formData.email}
		// 			onChange={handleChange}></input>{" "}
		// 		<br />
		// 		<br />
		// 		<label>password:</label>
		// 		<br />
		// 		<input
		// 			type="password"
		// 			name="password1"
		// 			value={formData.password1}
		// 			onChange={handleChange}></input>{" "}
		// 		<br />
		// 		<br />
		// 		<label>confirm password:</label>
		// 		<br />
		// 		<input
		// 			type="password"
		// 			name="password2"
		// 			value={formData.password2}
		// 			onChange={handleChange}></input>{" "}
		// 		<br />
		// 		<br />
		// 		<button type="submit" disabled={isLoading} onClick={handleSubmit}>
		// 			Register
		// 		</button>
		// 	</form>
		// </div>
	);
}
