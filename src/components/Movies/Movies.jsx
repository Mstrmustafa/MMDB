import React, { useState, useEffect } from "react";
// import './Movies.css';
import MovieApi from "../../API/MovieApi";
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Movies(props) {
    const [favorites, setFavorites] = useState({});
    const [movies, setMovies] = useState([]);
    const location = useLocation();
    const { category } = useParams() || "default";

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || {};
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                let moviesData;
                if (category === "popular") {
                    moviesData = await MovieApi.fetchPopularMovies();
                } else if (category === "now_playing") {
                    moviesData = await MovieApi.fetchNowPlayingMovies();
                } else if (category === "upcoming") {
                    moviesData = await MovieApi.fetchUpcomingMovies();
                } else if (category === "top_rated") {
                    moviesData = await MovieApi.fetchTopRatedMovies();
                } else {
                    moviesData = await MovieApi.fetchMovies();  // Default or general method
                }
                setMovies(moviesData);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, [category]);

    const toggleFavorite = (movie) => {
        setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites,kind:"movie" };
            if (newFavorites[movie.id]) {
                delete newFavorites[movie.id];  // Remove the movie if it's already in favorites
            } else {
                newFavorites[movie.id] = movie;  // Add the movie to favorites
            }
            localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const saveMovie = (movie) => {
        localStorage.setItem('movie', JSON.stringify(movie));
    };

    return (
        <div className="movies-container">
<h2>{category === undefined || category === 'default' ? 'Movies' : `${category} Movies`}</h2>
            {movies.map((movie) => {
                const isFavorite = Boolean(favorites[movie.id]);  // Check if the movie is in favorites
                return (
                    <div key={movie.id} className="movie-item">
                        <Link to={`/movie-details/${category}`}>
                            <img 
                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
                                alt={movie.title || 'Movie Poster'} 
                                onClick={() => saveMovie(movie)}
                            />
                        </Link>
                        <p>{movie?.title}</p>
                        <p>{movie.release_date}</p>
                        <div className="circle-rating">
                            <svg className="progress-circle" viewBox="0 0 36 36">
                                <path
                                    className="circle-bg"
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="circle"
                                    strokeDasharray={`${movie.vote_average * 10}, 100`}
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="20.35" className="percentage">{movie.vote_average}</text>
                            </svg>
                        </div>
                        <div 
                            className={`heart-icon ${isFavorite ? 'favorite' : ''}`} 
                            onClick={() => toggleFavorite(movie)}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Movies;
