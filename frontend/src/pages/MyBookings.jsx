import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/axiosConfig";

export default function MyBookings() {
	const navigate = useNavigate();
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
	}, []);

	const getStatusColor = (status) => {
		switch (status) {
			case "confirmed":
				return "bg-green-900 text-green-300 border-green-600";
			case "paid":
				return "bg-blue-900 text-blue-300 border-blue-600";
			case "pending":
				return "bg-yellow-900 text-yellow-300 border-yellow-600";
			case "cancelled":
				return "bg-red-900 text-red-300 border-red-600";
			default:
				return "bg-gray-900 text-gray-300 border-gray-600";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "confirmed":
				return "Potwierdzona";
			case "paid":
				return "Opłacona";
			case "pending":
				return "Oczekująca";
			case "cancelled":
				return "Anulowana";
			default:
				return status;
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-amber-400 text-xl">Ładowanie rezerwacji...</div>
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
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-amber-400 mb-2">
					Moje Rezerwacje
				</h1>
				<p className="text-gray-400">Liczba rezerwacji: {bookings.length}</p>
			</div>

			{bookings.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-400 text-lg mb-6">
						Nie masz jeszcze żadnych rezerwacji
					</div>
					<button
						onClick={() => navigate("/movies")}
						className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-md transition-all">
						Przeglądaj filmy
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{bookings.map((booking) => (
						<div
							key={booking.id}
							className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 hover:border-amber-400/30 transition-all">
							<div className="p-6">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
									<div className="flex-1">
										<h2 className="text-2xl font-bold text-white mb-2">
											{booking.screening.movie.title}
										</h2>
										<p className="text-gray-400 text-sm">
											Zarezerwowano: {formatDate(booking.booking_time)}
										</p>
									</div>
									<div>
										<span
											className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
												booking.status
											)}`}>
											{getStatusText(booking.status)}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black/30 rounded-lg">
									<div>
										<p className="text-gray-400 text-sm mb-1">Seans</p>
										<p className="text-white font-semibold">
											{formatDate(booking.screening.start_time)}
										</p>
									</div>
									<div>
										<p className="text-gray-400 text-sm mb-1">Miejsce</p>
										<p className="text-white font-semibold">
											Rząd {booking.seat.row_number}, Miejsce{" "}
											{booking.seat.seat_number}
										</p>
									</div>
									<div>
										<p className="text-gray-400 text-sm mb-1">Cena</p>
										<p className="text-amber-400 font-bold text-lg">
											{booking.total_price} zł
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
