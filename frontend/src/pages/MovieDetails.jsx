import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/axiosConfig";

export default function MovieDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [screenings, setScreenings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMovieDetails = async () => {
			try {
				const movieResponse = await apiClient.get(`/movies/${id}/`);
				setMovie(movieResponse.data);

				const screeningsResponse = await apiClient.get(
					`/movies/${id}/screenings/`
				);
				setScreenings(screeningsResponse.data);
			} catch (err) {
				setError("Nie udało się załadować filmu");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchMovieDetails();
	}, [id]);

	const getImageUrl = (imagePath) => {
		if (!imagePath) return null;
		if (imagePath.startsWith("http")) return imagePath;

		return `${import.meta.env.VITE_APP_URL}${imagePath}`;
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-amber-400 text-xl">Ładowanie...</div>
			</div>
		);
	}

	if (error || !movie) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-red-400 text-xl">
					{error || "Film nie znaleziony"}
				</div>
			</div>
		);
	}

	const imageUrl = getImageUrl(movie.image);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Przycisk powrotu */}
			<button
				onClick={() => navigate(-1)}
				className="text-amber-400 hover:text-amber-300 mb-6 flex items-center gap-2">
				← Powrót
			</button>

			{/* Główna sekcja z filmem */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				{/* Plakat */}
				<div className="md:col-span-1">
					{imageUrl && (
						<img
							src={imageUrl}
							alt={movie.title}
							className="w-full rounded-lg shadow-2xl"
						/>
					)}
				</div>

				{/* Informacje o filmie */}
				<div className="md:col-span-2">
					<h1 className="text-4xl font-bold text-amber-400 mb-4">
						{movie.title}
					</h1>

					<div className="flex gap-4 mb-6 text-gray-300">
						<span className="bg-gray-800 px-3 py-1 rounded">
							{movie.duration} min
						</span>
						<span className="bg-gray-800 px-3 py-1 rounded">
							{new Date(movie.created_at).getFullYear()}
						</span>
					</div>

					<h2 className="text-xl font-semibold text-white mb-3">Opis</h2>
					<p className="text-gray-300 leading-relaxed mb-6">
						{movie.description}
					</p>

					<button
						onClick={() => navigate(`/movie/${movie.id}/book`)}
						className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all">
						Zarezerwuj bilet
					</button>
				</div>
			</div>

			{/* Sekcja z seansami */}
			{screenings.length > 0 && (
				<div>
					<h2 className="text-3xl font-bold text-amber-400 mb-6">
						Dostępne Seanse
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{screenings.map((screening) => (
							<div
								key={screening.id}
								onClick={() => navigate(`/movie/${movie.id}/book`)}
								className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-amber-400 transition-all cursor-pointer">
								<div className="text-white font-semibold mb-2">
									{formatDate(screening.start_time)}
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-400">
										Dostępne: {screening.available_seats_count}
									</span>
									<span className="text-amber-400 font-bold">
										{screening.price} zł
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{screenings.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-400 text-lg">
						Brak dostępnych seansów dla tego filmu
					</p>
				</div>
			)}
		</div>
	);
}
