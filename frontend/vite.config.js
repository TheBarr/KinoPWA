import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["logo.png", "robots.txt"],
			manifest: {
				name: "Movie Ticket",
				short_name: "Movie Ticket",
				description: "Rezerwacja biletów kinowych",
				theme_color: "#f59e0b",
				background_color: "#1f2937",
				display: "standalone",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
				runtimeCaching: [
					{
						// FILMY - StaleWhileRevalidate
						urlPattern: /^https?:\/\/127\.0\.0\.1:8000\/api\/movies\/$/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "movies-cache",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24, // 1 dzień
							},
						},
					},
					{
						// MOJE REZERWACJE - CacheFirst
						urlPattern:
							/^https?:\/\/127\.0\.0\.1:8000\/api\/(my-bookings|bookings)\/$/i,
						handler: "CacheFirst",
						options: {
							cacheName: "bookings-cache",
							expiration: {
								maxEntries: 30,
								maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dni
							},
						},
					},
					{
						// SEANSE I MIEJSCA - NetworkFirst
						urlPattern:
							/^https?:\/\/127\.0\.0\.1:8000\/api\/(screenings|movies\/\d+\/screenings).*$/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "screenings-cache",
							networkTimeoutSeconds: 3, // Po 3 sek pokazuje cache
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 30, // 30 minut
							},
						},
					},
					{
						// OBRAZY - CacheFirst
						urlPattern: /^https?:\/\/127\.0\.0\.1:8000\/media\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "images-cache",
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dni
							},
						},
					},
				],
			},
		}),
	],
});
