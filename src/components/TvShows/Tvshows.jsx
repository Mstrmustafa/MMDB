import React, { useState, useEffect } from "react";
import './Tvshows.css';
import MovieApi from "../../API/MovieApi";
import { Link } from "react-router-dom";

function Tvshows(props) {
    const [favorites, setFavorites] = useState({});
    const [tvshows, setTvshows] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteTvshows')) || {};
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchTvshows = async () => {
            try {
                const tvshowData = await MovieApi.fetchTvshows(); 
                setTvshows(tvshowData); 
            } catch (error) {
                console.error("Error fetching TV shows:", error);
            } 
        };

        fetchTvshows();
    }, []);

    const toggleFavorite = (show) => {
        setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites };
            if (newFavorites[show.id]) {
                delete newFavorites[show.id];  // Remove the TV show if it's already in favorites
            } else {
                newFavorites[show.id] = show;  // Add the TV show to favorites
            }
            localStorage.setItem('favoriteTvshows', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const saveTvshow = (show) => {
        localStorage.setItem('tvshow', JSON.stringify(show));
    };

    return (
        <div className="movies-container">
            <h2>TV Shows</h2>
            {tvshows.map((show) => {
                const isFavorite = Boolean(favorites[show.id]);  // Check if the TV show is in favorites
                return (
                    <div key={show.id} className="movie-item">
                        <Link to="/tvshow-details">
                            <img 
                                src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} 
                                alt={show.name || 'TV Show Poster'} 
                                onClick={() => saveTvshow(show)}
                            />
                        </Link>
                        <p>{show.name}</p>
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
                            className={`heart-icon ${isFavorite ? 'favorite' : ''}`} 
                            onClick={() => toggleFavorite(show)}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Tvshows;
