import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./Movies.css";

const Movies = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await axios.get("http://127.0.0.1:8000/api/movies/");
				setMovies(response.data);
				setLoading(false);
			} catch (err) {
				setError("Nie udało się pobrać filmów");
				setLoading(false);
			}
		};

		fetchMovies();
	}, []);

	if (loading) return <div>Ładowanie...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="movies-container">
			<h1>Repertuar</h1>
			<div className="movies-grid">
				{movies.map((movie) => (
					<div key={movie.id} className="movie-card">
						{movie.image && (
							<img
								src={`http://127.0.0.1:8000${movie.image}`}
								alt={movie.title}
							/>
						)}
						<h2>{movie.title}</h2>
						<p>Czas trwania: {movie.duration} min</p>
						<p>{movie.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Movies;
