import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Ticket,
	Calendar,
	Clock,
	MapPin,
	CheckCircle2,
	XCircle,
	Film,
} from "lucide-react";
import apiClient from "../utils/axiosConfig";

export default function MyBookings() {
	const navigate = useNavigate();
	const location = useLocation();
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(
		location.state?.message || null
	);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await apiClient.get("/my-bookings/");
				setBookings(response.data);
			} catch (err) {
				setError("Nie udało się załadować rezerwacji");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();

		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(null), 4000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	const getStatusConfig = (status) => {
		const configs = {
			confirmed: {
				color: "bg-green-900/30 text-green-400 border-green-700",
				text: "Potwierdzona",
			},
			paid: {
				color: "bg-blue-900/30 text-blue-400 border-blue-700",
				text: "Opłacona",
			},
			pending: {
				color: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
				text: "Oczekująca",
			},
			cancelled: {
				color: "bg-red-900/30 text-red-400 border-red-700",
				text: "Anulowana",
			},
		};
		return configs[status] || configs.pending;
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("pl-PL", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const isUpcoming = (dateString) => {
		return new Date(dateString) > new Date();
	};

	const upcomingBookings = bookings.filter((b) =>
		isUpcoming(b.screening.start_time)
	);
	const pastBookings = bookings.filter(
		(b) => !isUpcoming(b.screening.start_time)
	);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
					<p className="text-amber-400">Ładowanie rezerwacji...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-4">
					<XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
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
		<div className="min-h-screen bg-stone-900">
			{/* Success Message */}
			{successMessage && (
				<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
					<div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
						<CheckCircle2 className="w-5 h-5" />
						<span>{successMessage}</span>
					</div>
				</div>
			)}

			{/* Header */}
			<div className="border-b border-gray-800">
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 flex items-center gap-3">
						<Ticket className="w-8 h-8" />
						Moje Bilety
					</h1>
					<p className="text-gray-400">
						{bookings.length}{" "}
						{bookings.length === 1 ? "rezerwacja" : "rezerwacji"}
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8 max-w-5xl">
				{bookings.length === 0 ? (
					/* Empty State */
					<div className="text-center py-16">
						<Ticket className="w-20 h-20 text-gray-700 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-white mb-2">
							Brak rezerwacji
						</h2>
						<p className="text-gray-400 mb-8">
							Nie masz jeszcze żadnych rezerwacji
						</p>
						<button
							onClick={() => navigate("/movies")}
							className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
							Przeglądaj filmy
						</button>
					</div>
				) : (
					<div className="space-y-10">
						{/* Upcoming Bookings */}
						{upcomingBookings.length > 0 && (
							<div>
								<h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
									<Calendar className="w-5 h-5 text-amber-400" />
									Nadchodzące seanse
									<span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-sm">
										{upcomingBookings.length}
									</span>
								</h2>

								<div className="space-y-4">
									{upcomingBookings.map((booking) => {
										const statusConfig = getStatusConfig(booking.status);

										return (
											<div
												key={booking.id}
												className="bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-400/50 transition-colors overflow-hidden">
												<div className="p-5">
													{/* Header */}
													<div className="flex items-start justify-between mb-4">
														<div className="flex-1">
															<h3 className="text-xl font-bold text-white mb-1">
																{booking.screening.movie.title}
															</h3>
															<p className="text-gray-500 text-sm">
																Zarezerwowano {formatDate(booking.booking_time)}
															</p>
														</div>
														<span
															className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
															{statusConfig.text}
														</span>
													</div>

													{/* Details */}
													<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
														<div>
															<p className="text-gray-500 text-xs mb-1">
																Data i godzina
															</p>
															<p className="text-white font-semibold">
																{formatDate(booking.screening.start_time)}
															</p>
															<p className="text-amber-400 font-bold text-lg">
																{formatTime(booking.screening.start_time)}
															</p>
														</div>

														<div>
															<p className="text-gray-500 text-xs mb-1">
																Miejsce
															</p>
															<p className="text-white font-semibold">
																Rząd {booking.seat.row_number}, Miejsce{" "}
																{booking.seat.seat_number}
															</p>
														</div>

														<div>
															<p className="text-gray-500 text-xs mb-1">Cena</p>
															<p className="text-white font-bold text-xl">
																{booking.total_price} zł
															</p>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Past Bookings */}
						{pastBookings.length > 0 && (
							<div>
								<h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
									<Clock className="w-5 h-5" />
									Archiwum
									<span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded text-sm">
										{pastBookings.length}
									</span>
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{pastBookings.map((booking) => {
										const statusConfig = getStatusConfig(booking.status);

										return (
											<div
												key={booking.id}
												className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4">
												<div className="flex items-start justify-between mb-3">
													<h3 className="text-lg font-semibold text-gray-300 flex-1">
														{booking.screening.movie.title}
													</h3>
													<span
														className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.color.replace(
															"border-",
															"border-0 "
														)}`}>
														{statusConfig.text}
													</span>
												</div>

												<div className="space-y-2 text-sm text-gray-400">
													<p className="flex items-center gap-2">
														<Calendar className="w-4 h-4" />
														{formatDate(booking.screening.start_time)} •{" "}
														{formatTime(booking.screening.start_time)}
													</p>
													<p className="flex items-center gap-2">
														<MapPin className="w-4 h-4" />
														Rząd {booking.seat.row_number}, Miejsce{" "}
														{booking.seat.seat_number}
													</p>
													<p className="text-white font-semibold">
														{booking.total_price} zł
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			<style>{`
				@keyframes fade-in {
					from { opacity: 0; transform: translate(-50%, -10px); }
					to { opacity: 1; transform: translate(-50%, 0); }
				}
				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}
			`}</style>
		</div>
	);
}
