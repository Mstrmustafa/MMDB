import React, { useState, useEffect } from "react";
import '../Movies/Movies.css'
import { Link } from 'react-router-dom';

function FavoriteMovies(props) {
    const [favorites, setFavorites] = useState({});
    // const location = useLocation();

    // Load favorites from local storage when the component mounts
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || {};
        setFavorites(storedFavorites)
    }, []);

    // Toggle favorite status for a movie
    const toggleFavorite = (movie) => {
        setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites };
            if (newFavorites[movie.id]) {
                delete newFavorites[movie.id];  // Remove the movie if it's already in favorites
            } else {
                newFavorites[movie.id] = { ...movie, kind: 'movie' };  // Add the movie to favorites with 'kind' as 'movie'
            }
            localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
            return newFavorites;

        });
    };

    // Save the selected movie in local storage to access on the details page
    const saveMovie = (movie) => {
        localStorage.setItem('movie', JSON.stringify(movie));
    };

    return (
        <div className="movies-container">
            {Object.keys(favorites).length!==0 && <h2>Favorite Movies</h2>}
            
            {Object.values(favorites).map((movie) => {
                console.log("fav:",movie)
                if (movie.poster_path && movie.title) {
                    return (
                        <div key={movie.id} className="movie-item">
                            <Link to={`/movie-details/fav`}>
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
                                className={`heart-icon ${favorites[movie.id] ? 'favorite' : ''}`} 
                                onClick={() => toggleFavorite(movie)}
                            >
                                {favorites[movie.id] ? '❤️' : '🤍'}
                            </div>
                        </div>
                    );
                } else {
                    return null; // If movie data is incomplete, don't render it
                }
            })}
        </div>
    );
}

export default FavoriteMovies;
