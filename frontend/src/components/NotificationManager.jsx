import { useEffect, useState } from "react";
import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { initializeMessaging, VAPID_KEY } from "../firebase/config";
import apiClient from "../utils/axiosConfig";
import { useAuth } from "../utils/AuthContext";

export default function NotificationManager() {
	const { isLoggedIn } = useAuth();
	const [showBanner, setShowBanner] = useState(false);
	const [messaging, setMessaging] = useState(null);

	// Inicjalizacja Firebase Messaging
	useEffect(() => {
		const init = async () => {
			const messagingInstance = await initializeMessaging();
			setMessaging(messagingInstance);
		};
		init();
	}, []);

	// Sprawdź czy pokazać banner
	useEffect(() => {
		if (isLoggedIn && messaging && Notification.permission === "default") {
			const timer = setTimeout(() => setShowBanner(true), 3000);
			return () => clearTimeout(timer);
		}
	}, [isLoggedIn, messaging]);

	// Nasłuchuj powiadomień gdy aplikacja otwarta
	useEffect(() => {
		if (!messaging) return;

		const unsubscribe = onMessage(messaging, (payload) => {
			console.log("Powiadomienie otrzymane:", payload);

			if (Notification.permission === "granted") {
				const title = payload.notification?.title || "Nowe powiadomienie";
				const options = {
					body: payload.notification?.body || "",
					icon: "/pwa-192x192.png",
					badge: "/pwa-192x192.png",
					tag: "movie-ticket-notification",
					requireInteraction: false,
				};

				const notification = new Notification(title, options);
				setTimeout(() => notification.close(), 5000);
			}
		});

		return () => unsubscribe();
	}, [messaging]);

	// AUTOMATYCZNE odświeżenie tokena przy logowaniu (jeśli już jest pozwolenie)
	useEffect(() => {
		const refreshTokenIfNeeded = async () => {
			if (!isLoggedIn || !messaging) return;

			// Tylko jeśli użytkownik JUŻ ma pozwolenie
			if (Notification.permission === "granted") {
				try {
					console.log("Odświeżam token dla nowego użytkownika...");

					// Usuń stary token
					try {
						await deleteToken(messaging);
						console.log("Stary token usunięty");
					} catch (e) {
						console.log("Brak starego tokena");
					}

					// Pobierz nowy token
					const token = await getToken(messaging, { vapidKey: VAPID_KEY });

					if (token) {
						await apiClient.post("/notifications/register/", {
							fcm_token: token,
						});
						console.log("Token automatycznie odświeżony");
					}
				} catch (error) {
					console.error("Błąd odświeżania tokena:", error);
				}
			}
		};

		refreshTokenIfNeeded();
	}, [isLoggedIn, messaging]);

	const enableNotifications = async () => {
		try {
			if (!messaging) {
				alert("Powiadomienia nie są wspierane");
				setShowBanner(false);
				return;
			}

			// Poproś o pozwolenie
			const permission = await Notification.requestPermission();
			console.log("Status pozwolenia:", permission);

			if (permission !== "granted") {
				alert(
					"Zablokowano powiadomienia. Włącz je w ustawieniach przeglądarki."
				);
				setShowBanner(false);
				return;
			}

			// Usuń stary token (jeśli istnieje)
			try {
				await deleteToken(messaging);
				console.log("Stary token usunięty");
			} catch (e) {
				console.log("Brak starego tokena");
			}

			// Pobierz nowy token
			const token = await getToken(messaging, { vapidKey: VAPID_KEY });
			console.log("Nowy token FCM:", token.substring(0, 20) + "...");

			if (!token) {
				throw new Error("Nie udało się pobrać tokena");
			}

			// Zapisz w bazie
			await apiClient.post("/notifications/register/", {
				fcm_token: token,
			});

			console.log("Token zapisany w bazie");

			// Pokaż testowe powiadomienie
			new Notification("Powiadomienia włączone!", {
				body: "Będziesz otrzymywać przypomnienia o seansach",
				icon: "/pwa-192x192.png",
			});

			setShowBanner(false);
		} catch (error) {
			console.error("Błąd:", error);
			alert(`Błąd: ${error.message}`);
		}
	};

	if (!showBanner) return null;

	return (
		<div className="bg-blue-600 text-white px-4 py-3">
			<div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<svg
						className="w-6 h-6 flex-shrink-0"
						fill="currentColor"
						viewBox="0 0 20 20">
						<path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
					</svg>
					<p className="font-medium">Włącz powiadomienia o seansach!</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={enableNotifications}
						className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100">
						Włącz
					</button>
					<button
						onClick={() => setShowBanner(false)}
						className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg">
						Nie teraz
					</button>
				</div>
			</div>
		</div>
	);
}
