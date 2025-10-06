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
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/127\.0\.0\.1:8000\/api\/.*/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "api-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60,
							},
						},
					},
				],
			},
		}),
	],
});
