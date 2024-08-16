import React, { useState, useEffect } from "react";
import '../Movies/Movies.css'
import { Link } from "react-router-dom";

function FavoriteTvshows(props) {
    const [favorites, setFavorites] = useState({});
    
    // Load favorites from local storage when the component mounts
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteTvshows')) || {};
        setFavorites(storedFavorites);
    }, []);

    // Toggle favorite status for a TV show
    const toggleFavorite = (show) => {
        setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites };
            if (newFavorites[show.id]) {
                delete newFavorites[show.id];  // Remove the TV show if it's already in favorites
            } else {
                newFavorites[show.id] = { ...show, kind: 'tvshow' };  // Add the TV show to favorites with 'kind' as 'tvshow'
            }
            localStorage.setItem('favoriteTvshows', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    // Save the selected TV show in local storage to access on the details page
    const saveTvshow = (show) => {
        localStorage.setItem('tvshow', JSON.stringify(show));
    };

    return (
        <div className="movies-container">
            <h2>Favorite TV Shows</h2>
            {Object.values(favorites).map((show) => {
                // Add a check to ensure all necessary TV show properties are present
                if (show.poster_path && show.name) {
                    return (
                        <div key={show.id} className="movie-item">
                            <Link to={`/tvshow-details/fav`}>
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} 
                                    alt={show.name || 'TV Show Poster'} 
                                    onClick={() => saveTvshow(show)}
                                />
                            </Link>
                            <p>{show?.name}</p>
                            <p>{show.first_air_date}</p>
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
                                        strokeDasharray={`${show.vote_average * 10}, 100`}
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="percentage">{show.vote_average}</text>
                                </svg>
                            </div>
                            <div 
                                className={`heart-icon ${favorites[show.id] ? 'favorite' : ''}`} 
                                onClick={() => toggleFavorite(show)}
                            >
                                {favorites[show.id] ? '❤️' : '🤍'}
                            </div>
                        </div>
                    );
                } 
            })}
        </div>
    );
}

export default FavoriteTvshows;
