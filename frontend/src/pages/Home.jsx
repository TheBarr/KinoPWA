import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import apiClient from "../utils/axiosConfig";

export default function Home() {
	const navigate = useNavigate();
	const { isLoggedIn } = useAuth();
	const [movies, setMovies] = useState([]);
	const [upcomingScreenings, setUpcomingScreenings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			// Jeśli niezalogowany, nie pobieraj danych
			if (!isLoggedIn) {
				setLoading(false);
				return;
			}

			try {
				// Pobierz filmy
				const moviesResponse = await apiClient.get("/movies/");
				setMovies(moviesResponse.data.slice(0, 6)); // Tylko 6 najnowszych

				// Pobierz nadchodzące seanse
				const screeningsResponse = await apiClient.get("/screenings/");

				// Filtruj tylko przyszłe seanse i weź 8 najbliższych
				const now = new Date();
				const upcoming = screeningsResponse.data
					.filter((s) => new Date(s.start_time) > now)
					.slice(0, 8);

				setUpcomingScreenings(upcoming);
			} catch (err) {
				console.error("Błąd pobierania danych:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [isLoggedIn]);

	const getImageUrl = (imagePath) => {
		if (!imagePath) return null;
		if (imagePath.startsWith("http")) return imagePath;
		return `http://127.0.0.1:8000${imagePath}`;
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL", {
			day: "numeric",
			month: "short",
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

	// Widok dla NIEZALOGOWANYCH użytkowników
	if (!isLoggedIn) {
		return (
			<div className="min-h-[calc(100vh-136px)] flex items-center justify-center px-4">
				<div className="max-w-2xl text-center">
					<div className="mb-8">
						<h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 mb-4">
							CINEMA TICKETS
						</h1>
						<p className="text-xl md:text-2xl text-gray-300 mb-8">
							Twoje kino online - rezerwuj bilety w mgnieniu oka
						</p>
					</div>

					<div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border-2 border-amber-400/30 shadow-2xl mb-8">
						<svg
							className="w-20 h-20 text-amber-400 mx-auto mb-6"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
								clipRule="evenodd"
							/>
						</svg>
						<h2 className="text-3xl font-bold text-white mb-4">
							Zaloguj się, aby kontynuować
						</h2>
						<p className="text-gray-300 mb-8 text-lg">
							Aby przeglądać repertuar i rezerwować bilety, musisz być
							zalogowany
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={() => navigate("/login")}
								className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-xl">
								Zaloguj się
							</button>
							<button
								onClick={() => navigate("/register")}
								className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-lg transition-all border-2 border-gray-600 hover:border-amber-400">
								Zarejestruj się
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
						<div className="bg-gray-800/50 p-6 rounded-lg">
							<div className="text-amber-400 text-3xl mb-3">🎬</div>
							<h3 className="text-white font-bold mb-2">Szeroki wybór</h3>
							<p className="text-gray-400 text-sm">
								Najnowsze premiery i klasyki kina
							</p>
						</div>
						<div className="bg-gray-800/50 p-6 rounded-lg">
							<div className="text-amber-400 text-3xl mb-3">⚡</div>
							<h3 className="text-white font-bold mb-2">Szybka rezerwacja</h3>
							<p className="text-gray-400 text-sm">
								Zarezerwuj bilet w kilka sekund
							</p>
						</div>
						<div className="bg-gray-800/50 p-6 rounded-lg">
							<div className="text-amber-400 text-3xl mb-3">🎫</div>
							<h3 className="text-white font-bold mb-2">Wybór miejsc</h3>
							<p className="text-gray-400 text-sm">
								Interaktywna mapa sali kinowej
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Widok dla ZALOGOWANYCH użytkowników

	return (
		<div className="min-h-[calc(100vh-136px)]">
			{/* Sekcja logo*/}
			<section className="relative h-[500px] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-transparent">
				<div className="relative text-center px-4 z-10">
					<h1 className="text-6xl md:text-7xl font-bold text-amber-400 mb-4 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
						CINEMA TICKETS
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 mb-8">
						Twoje kino online - rezerwuj bilety w mgnieniu oka
					</p>
					<button
						onClick={() => navigate("/movies")}
						className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-amber-500/50">
						Zobacz Repertuar
					</button>
				</div>
			</section>

			<div className="container mx-auto px-4 py-12">
				{/* Nadchodzące Seanse */}
				{upcomingScreenings.length > 0 && (
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
							<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
									clipRule="evenodd"
								/>
							</svg>
							Nadchodzące Seanse
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{upcomingScreenings.map((screening) => (
								<div
									key={screening.id}
									onClick={() => navigate(`/movie/${screening.movie.id}/book`)}
									className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-lg border border-gray-700 hover:border-amber-400 transition-all cursor-pointer group hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1">
									<h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
										{screening.movie.title}
									</h3>
									<div className="space-y-2 text-sm">
										<p className="text-amber-400 font-semibold">
											{formatDate(screening.start_time)}
										</p>
										<p className="text-gray-400">
											Dostępne: {screening.available_seats_count} miejsc
										</p>
										<p className="text-white font-bold">{screening.price} zł</p>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Najnowsze Filmy */}
				<section>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold text-amber-400 flex items-center gap-3">
							<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
							</svg>
							Aktualny Repertuar
						</h2>
						<button
							onClick={() => navigate("/movies")}
							className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-2">
							Zobacz wszystkie
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{movies.map((movie) => {
							const imageUrl = getImageUrl(movie.image);
							return (
								<div
									key={movie.id}
									onClick={() => navigate(`/movie/${movie.id}/book`)}
									className="group cursor-pointer">
									<div className="relative overflow-hidden rounded-lg mb-2 bg-gray-900 aspect-[2/3]">
										{imageUrl && (
											<img
												src={imageUrl}
												alt={movie.title}
												className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
											<span className="text-white font-bold">Rezerwuj</span>
										</div>
									</div>
									<h3 className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors line-clamp-2">
										{movie.title}
									</h3>
									<p className="text-gray-400 text-xs">{movie.duration} min</p>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
