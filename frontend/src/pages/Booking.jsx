import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/axiosConfig";

export default function BookingPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [screenings, setScreenings] = useState([]);
	const [selectedScreening, setSelectedScreening] = useState(null);
	const [seats, setSeats] = useState([]);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [bookingLoading, setBookingLoading] = useState(false);
	const [error, setError] = useState(null);

	// Pobierz film i seanse
	useEffect(() => {
		const fetchMovieAndScreenings = async () => {
			try {
				const movieResponse = await apiClient.get(`/movies/${id}/`);
				setMovie(movieResponse.data);

				const screeningsResponse = await apiClient.get(
					`/movies/${id}/screenings/`
				);
				setScreenings(screeningsResponse.data);
			} catch (err) {
				setError("Nie udało się załadować danych");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchMovieAndScreenings();
	}, [id]);

	// Pobierz miejsca dla wybranego seansu
	useEffect(() => {
		if (selectedScreening) {
			const fetchSeats = async () => {
				try {
					// ZMIENIONE
					const response = await apiClient.get(
						`/screenings/${selectedScreening.id}/seats/`
					);
					setSeats(response.data);
				} catch (err) {
					console.error("Błąd pobierania miejsc:", err);
				}
			};

			fetchSeats();
		}
	}, [selectedScreening]);

	// Obsługa wyboru/odznaczenia miejsca
	const toggleSeatSelection = (seat) => {
		setSelectedSeats((prev) => {
			const isSelected = prev.some((s) => s.id === seat.id);
			if (isSelected) {
				return prev.filter((s) => s.id !== seat.id);
			} else {
				return [...prev, seat];
			}
		});
	};

	// Zarezerwuj wszystkie wybrane miejsca
	const handleBooking = async () => {
		if (selectedSeats.length === 0 || !selectedScreening) return;

		setBookingLoading(true);
		try {
			// ZMIENIONE - usuń token i config
			const bookingPromises = selectedSeats.map((seat) =>
				apiClient.post("/bookings/", {
					screening: selectedScreening.id,
					seat: seat.id,
				})
			);

			await Promise.all(bookingPromises);

			alert(`Zarezerwowano ${selectedSeats.length} miejsc!`);
			navigate("/my-bookings");
		} catch (err) {
			alert(err.response?.data?.non_field_errors?.[0] || "Błąd rezerwacji");
			console.error(err);
		} finally {
			setBookingLoading(false);
		}
	};

	// Grupuj miejsca po rzędach
	const groupedSeats = seats.reduce((acc, seat) => {
		if (!acc[seat.row_number]) {
			acc[seat.row_number] = [];
		}
		acc[seat.row_number].push(seat);
		return acc;
	}, {});

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-amber-400 text-xl">Ładowanie...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-red-400 text-xl">{error}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Nagłówek z informacją o filmie */}
			<div className="mb-8">
				<button
					onClick={() => navigate(-1)}
					className="text-amber-400 hover:text-amber-300 mb-4 flex items-center gap-2">
					← Powrót
				</button>
				<h1 className="text-4xl font-bold text-amber-400 mb-2">
					{movie?.title}
				</h1>
				<p className="text-gray-300">{movie?.duration} min</p>
			</div>

			{/* Wybór seansu */}
			{!selectedScreening && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-white mb-4">Wybierz seans</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{screenings.map((screening) => (
							<button
								key={screening.id}
								onClick={() => setSelectedScreening(screening)}
								className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-transparent hover:border-amber-400 transition-all">
								<div className="text-white font-semibold mb-2">
									{new Date(screening.start_time).toLocaleDateString("pl-PL", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</div>
								<div className="text-amber-400 text-xl font-bold">
									{new Date(screening.start_time).toLocaleTimeString("pl-PL", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
								<div className="text-gray-400 mt-2">
									Dostępne miejsca: {screening.available_seats_count}
								</div>
								<div className="text-white mt-2">
									Cena: {screening.price} zł
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Mapa miejsc */}
			{selectedScreening && (
				<div>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-white">Wybierz miejsce</h2>
						<button
							onClick={() => {
								setSelectedScreening(null);
								setSelectedSeats(null);
							}}
							className="text-amber-400 hover:text-amber-300">
							Zmień seans
						</button>
					</div>

					{/* Ekran */}
					<div className="mb-8">
						<div className="w-full max-w-3xl mx-auto h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-2"></div>
						<p className="text-center text-amber-400 text-sm">EKRAN</p>
					</div>

					{/* Miejsca */}
					<div className="space-y-2 mb-8 overflow-x-auto">
						{Object.entries(groupedSeats).map(([rowNumber, rowSeats]) => (
							<div
								key={rowNumber}
								className="flex items-center justify-center gap-2 min-w-max px-4">
								<span className="text-gray-400 w-6 text-right font-mono text-sm">
									{rowNumber}
								</span>
								<div className="flex gap-1 sm:gap-2">
									{rowSeats.map((seat) => {
										const isSelected = selectedSeats.some(
											(s) => s.id === seat.id
										);
										return (
											<button
												key={seat.id}
												onClick={() => toggleSeatSelection(seat)}
												disabled={seat.is_booked || !seat.is_active}
												className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md font-mono text-xs sm:text-sm transition-all ${
													seat.is_booked
														? "bg-red-900 cursor-not-allowed"
														: isSelected
														? "bg-amber-500 text-black font-bold scale-110"
														: seat.is_active
														? "bg-gray-700 hover:bg-amber-600 hover:scale-110"
														: "bg-gray-900 cursor-not-allowed"
												}`}>
												{seat.seat_number}
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>

					{/* Legenda */}
					<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 justify-center text-sm">
						<div className="flex items-center gap-2 justify-center">
							<div className="w-8 h-8 bg-gray-700 rounded-md"></div>
							<span className="text-gray-300">Dostępne</span>
						</div>
						<div className="flex items-center gap-2 justify-center">
							<div className="w-8 h-8 bg-amber-500 rounded-md"></div>
							<span className="text-gray-300">Wybrane</span>
						</div>
						<div className="flex items-center gap-2 justify-center">
							<div className="w-8 h-8 bg-red-900 rounded-md"></div>
							<span className="text-gray-300">Zajęte</span>
						</div>
					</div>

					{/* Podsumowanie i przycisk rezerwacji */}
					{selectedSeats.length > 0 && (
						<div className="bg-gray-800 p-6 rounded-lg">
							<h3 className="text-xl font-bold text-white mb-4">
								Podsumowanie
							</h3>
							<div className="space-y-2 text-gray-300 mb-6">
								<p>
									Film: <span className="text-white">{movie?.title}</span>
								</p>
								<p>
									Data:{" "}
									<span className="text-white">
										{new Date(selectedScreening.start_time).toLocaleString(
											"pl-PL"
										)}
									</span>
								</p>
								<p>
									Liczba miejsc:{" "}
									<span className="text-white">{selectedSeats.length}</span>
								</p>
								<p>
									Miejsca:{" "}
									<span className="text-white">
										{selectedSeats
											.map(
												(seat) =>
													`Rząd ${seat.row_number}, Miejsce ${seat.seat_number}`
											)
											.join(" | ")}
									</span>
								</p>
								<p className="text-xl font-bold text-amber-400 mt-4">
									Łączna cena:{" "}
									{(selectedScreening.price * selectedSeats.length).toFixed(2)}{" "}
									zł
								</p>
							</div>
							<button
								onClick={handleBooking}
								disabled={bookingLoading}
								className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
								{bookingLoading
									? "Rezerwacja..."
									: `Potwierdź rezerwację (${selectedSeats.length} ${
											selectedSeats.length === 1 ? "miejsce" : "miejsca"
									  })`}
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
