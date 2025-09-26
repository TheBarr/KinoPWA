import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Movies from "./components/Movies";
import ProtectedRoute from "./utils/ProtectedRoutes";
import PublicRoute from "./utils/PublicRoute";

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
