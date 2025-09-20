import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Movies from "./components/Movies";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						{/* <Route element={<ProtectedRoutes />}> */}
						<Route path="movies" element={<Movies />} />
						{/* </Route> */}
						<Route path="login" element={<Login />} />
						<Route path="register" element={<Register />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
