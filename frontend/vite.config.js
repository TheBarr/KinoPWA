import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
<<<<<<< HEAD
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
                        // FILMY - NetworkFirst 
                        urlPattern: /^https?:\/\/.*\/api\/movies.*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "movies-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24, // 1 dzień
                            },
                        },
                    },
                    {
                        // MOJE REZERWACJE I BOOKINGS - NetworkFirst 
                        urlPattern: /^https?:\/\/.*\/api\/(my-bookings|bookings).*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "bookings-cache",
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dni dla trybu offline
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        // SEANSE I MIEJSCA - NetworkFirst 
                        urlPattern: /^https?:\/\/.*\/api\/(screenings|movies\/\d+\/screenings).*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "screenings-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 30, // 30 minut dla offline
                            },
                        },
                    },
                    {
                        // OBRAZY - CacheFirst 
                        urlPattern: /^https?:\/\/.*\/media\/.*/i,
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
=======
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
						urlPattern: /^https?:\/\/.*\/api\/movies\/$/i,
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
						// ⭐ MOJE REZERWACJE - NetworkFirst (świeże online, cache offline)
						urlPattern: /^https?:\/\/.*\/api\/(my-bookings|bookings)\/.*$/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "bookings-cache",
							networkTimeoutSeconds: 3, // Szybki fallback do cache
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dni dla offline
							},
							cacheableResponse: {
								statuses: [0, 200], // Cache tylko OK responses
							},
						},
					},
					{
						// SEANSE I MIEJSCA - NetworkFirst
						urlPattern:
							/^https?:\/\/.*\/api\/(screenings|movies\/\d+\/screenings).*$/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "screenings-cache",
							networkTimeoutSeconds: 3,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 30, // 30 minut
							},
						},
					},
					{
						// OBRAZY - CacheFirst
						urlPattern: /^https?:\/\/.*\/media\/.*/i,
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
	// --------------------
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
			"/media": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
		},
	},
	preview: {
		allowedHosts: [
			".ngrok.io",
			".ngrok-free.dev",
			".ngrok-free.app",
			"unapplicably-wackier-debra.ngrok-free.dev",
		], // DODAJ TO
		proxy: {
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
			"/media": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
		},
	},
});
>>>>>>> 32da2c3bc94f701fad1d7cf9c4054d323c7913f1
