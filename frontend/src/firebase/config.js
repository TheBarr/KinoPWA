import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const VAPID_KEY = import.meta.env.FIREBASE_VAPID_KEY;

const app = initializeApp(firebaseConfig);
let messaging = null;

const initializeMessaging = async () => {
	try {
		const supported = await isSupported();
		if (supported) {
			messaging = getMessaging(app);
			console.log("Firebase Messaging zainicjalizowane");
			return messaging;
		} else {
			console.log("Firebase Messaging nie jest wspierane");
			return null;
		}
	} catch (error) {
		console.error("Błąd inicjalizacji Firebase Messaging:", error);
		return null;
	}
};

export { initializeMessaging, VAPID_KEY };
