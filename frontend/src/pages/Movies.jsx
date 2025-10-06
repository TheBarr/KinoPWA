import React, { useState, useEffect } from "react";
import apiClient from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Movies = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await apiClient.get("/movies/");
				setMovies(response.data);
				setLoading(false);
			} catch (err) {
				setError("Nie udało się pobrać filmów");
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};
		fetchMovies();
	}, []);

	const getImageUrl = (imageUrl) => {
		if (!imageUrl) return null;
		if (imageUrl.startsWith("http")) {
			return imageUrl;
		}
		return `http://127.0.0.1:8000${imageUrl}`;
	};

	const handleImageError = (e) => {
		e.currentTarget.onerror = null;
		e.target.src = "https://placehold.co/600x400";
	};

	if (loading) return <div className="text-white">Ładowanie filmów...</div>;
	if (error)
		return (
			<div>
				{error}{" "}
				<button onClick={() => window.location.reload()}>
					Spróbuj ponownie
				</button>
			</div>
		);

	return (
		<section className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold text-amber-400 mb-8 text-center">
				REPERTUAR
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{movies.map((movie) => {
					const imageUrl = getImageUrl(movie.image) || PLACEHOLDER;
					return (
						<article
							key={movie.id}
							aria-label={movie.title}
							className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2">
							<figure
								className="relative overflow-hidden bg-gray-900"
								onClick={() => navigate(`/movie/${movie.id}`)}>
								<img
									src={imageUrl}
									alt={movie.title ? `${movie.title} — plakat` : "Plakat filmu"}
									onError={handleImageError}
									loading="lazy"
									className="w-full h-[400px] object-contain group-hover:scale-105 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
								<figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
									<h2 className="text-xl font-bold text-white truncate">
										{movie.title}
									</h2>
								</figcaption>
							</figure>

							<div className="p-5 space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="flex items-center gap-1 text-amber-400 font-medium">
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
												clipRule="evenodd"
											/>
										</svg>
										{movie.duration} min
									</span>
								</div>

								<p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
									{movie.description}
								</p>
								<button
									onClick={() => navigate(`/movie/${movie.id}`)}
									className="text-white cursor-pointer">
									Zobacz szczegóły
								</button>
								<button
									onClick={() => navigate(`/movie/${movie.id}/book`)}
									className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50">
									Zarezerwuj bilet
								</button>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default Movies;
