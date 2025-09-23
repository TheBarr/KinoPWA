import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Movies from "./components/Movies";
import ProtectedRoute from "./utils/ProtectedRoutes";
import PublicRoute from "./utils/PublicRoute";

function App() {
	return (
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
	);
}

export default App;
