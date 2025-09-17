import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/movies.css";

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

	const getImageUrl = (imageUrl) => {
		if (!imageUrl) return null;
		if (imageUrl.startsWith("http")) {
			return imageUrl;
		}
		return `http://127.0.0.1:8000${imageUrl}`;
	};

	const handleImageError = (e) => {
		e.target.src =
			"https://via.placeholder.com/280x350/667eea/white?text=Brak+Obrazu";
	};

	if (loading) return <div className="loading">Ładowanie filmów...</div>;
	if (error) return <div className="error">{error}</div>;

	return (
		<div className="movies-container">
			<h1>REPERTUAR</h1>
			<div className="movies-grid">
				{movies.map((movie) => {
					const imageUrl = getImageUrl(movie.image);

					return (
						<div key={movie.id} className="movie-card">
							<img
								src={
									imageUrl ||
									"https://via.placeholder.com/280x350/667eea/white?text=Brak+Obrazu"
								}
								alt={movie.title}
								onError={handleImageError}
							/>
							<div className="movie-info">
								<h2>{movie.title}</h2>
								<div className="movie-duration">{movie.duration} min</div>
								<p className="movie-description">{movie.description}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Movies;
