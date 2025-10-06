import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import ProtectedRoute from "./utils/ProtectedRoutes";
import PublicRoute from "./utils/PublicRoute";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import MovieDetails from "./pages/MovieDetails";

function App() {
	return (
		<AuthProvider>
			{" "}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route
							path="movies"
							element={
								<ProtectedRoute>
									<Movies />
								</ProtectedRoute>
							}
						/>
						<Route
							path="movie/:id"
							element={
								<ProtectedRoute>
									<MovieDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="movie/:id/book"
							element={
								<ProtectedRoute>
									<Booking />
								</ProtectedRoute>
							}
						/>
						<Route
							path="my-bookings"
							element={
								<ProtectedRoute>
									<MyBookings />
								</ProtectedRoute>
							}
						/>
						<Route
							path="login"
							element={
								<PublicRoute>
									<Login />
								</PublicRoute>
							}
						/>
						<Route
							path="register"
							element={
								<PublicRoute>
									<Register />
								</PublicRoute>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
