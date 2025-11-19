import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, X } from "lucide-react";
import apiClient from "../utils/axiosConfig";

const Movies = () => {
	const [movies, setMovies] = useState([]);
	const [filteredMovies, setFilteredMovies] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
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
				setFilteredMovies(response.data);
			} catch (err) {
				setError("Nie udało się pobrać filmów");
			} finally {
				setLoading(false);
			}
		};
		fetchMovies();
	}, []);

	// Wyszukiwanie
	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredMovies(movies);
		} else {
			const filtered = movies.filter((movie) =>
				movie.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredMovies(filtered);
		}
	}, [searchQuery, movies]);

	const getImageUrl = (imageUrl) => {
		if (!imageUrl) return null;
		if (imageUrl.startsWith("http")) {
			return imageUrl;
		}
		return `${import.meta.env.VITE_APP_URL}${imageUrl}`;
	};

	const handleImageError = (e) => {
		e.currentTarget.onerror = null;
		e.target.src = "https://placehold.co/600x400?text=Brak+plakatu";
	};

	const clearSearch = () => {
		setSearchQuery("");
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
					<p className="text-amber-400">Ładowanie filmów...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-4">
					<div className="text-red-400 text-6xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-white mb-2">Ups!</h2>
					<p className="text-gray-400 mb-6">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
						Spróbuj ponownie
					</button>
				</div>
			</div>
		);
	}

	return (
		<section className="container mx-auto px-4 py-8">
			{/* Header z wyszukiwaniem */}
			<div className="mb-8">
				<h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-6 text-center">
					REPERTUAR
				</h1>

				{/* Search Bar */}
				<div className="max-w-2xl mx-auto">
					<div className="relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Szukaj filmu po tytule..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
						/>
						{searchQuery && (
							<button
								onClick={clearSearch}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
								<X className="w-5 h-5" />
							</button>
						)}
					</div>

					{/* Results count */}
					<p className="text-gray-400 text-sm mt-2 text-center">
						{filteredMovies.length === movies.length
							? `Wyświetlanie wszystkich ${movies.length} filmów`
							: `Znaleziono ${filteredMovies.length} ${
									filteredMovies.length === 1 ? "film" : "filmów"
							  }`}
					</p>
				</div>
			</div>

			{/* Movies Grid */}
			{filteredMovies.length === 0 ? (
				<div className="text-center py-16">
					<Search className="w-20 h-20 text-gray-700 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-white mb-2">
						Nie znaleziono filmów
					</h2>
					<p className="text-gray-400 mb-6">Spróbuj wyszukać inny tytuł</p>
					<button
						onClick={clearSearch}
						className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
						Wyczyść wyszukiwanie
					</button>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{filteredMovies.map((movie) => {
						const imageUrl = getImageUrl(movie.image);

						return (
							<article
								key={movie.id}
								className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-amber-400/50 transition-all">
								{/* Movie Poster */}
								<figure
									className="relative overflow-hidden bg-black cursor-pointer aspect-[2/3]"
									onClick={() => navigate(`/movie/${movie.id}`)}>
									<img
										src={
											imageUrl ||
											"https://placehold.co/600x900?text=Brak+plakatu"
										}
										alt={`${movie.title} - plakat`}
										onError={handleImageError}
										loading="lazy"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
									<figcaption className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
										<h2 className="text-sm font-bold text-white line-clamp-1">
											{movie.title}
										</h2>
									</figcaption>
								</figure>

								{/* Movie Info */}
								<div className="p-3 space-y-2">
									<div className="flex items-center gap-1.5 text-amber-400 text-xs">
										<Clock className="w-3.5 h-3.5" />
										<span>{movie.duration} min</span>
									</div>

									<p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
										{movie.description}
									</p>

									<div className="flex flex-col gap-1.5 pt-1">
										<button
											onClick={() => navigate(`/movie/${movie.id}`)}
											className="w-full py-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors text-xs">
											Szczegóły
										</button>
										<button
											onClick={() => navigate(`/movie/${movie.id}/book`)}
											className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md transition-colors text-sm">
											Rezerwuj
										</button>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</section>
	);
};

export default Movies;
