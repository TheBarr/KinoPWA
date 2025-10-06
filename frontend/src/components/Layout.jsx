import Header from "./Header";
import React from "react";
import { Outlet, Link } from "react-router-dom";
export default function Layout() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="bg-stone-900 min-h-[calc(100vh-136px)]">
				<Outlet />
			</main>
		</div>
	);
}
