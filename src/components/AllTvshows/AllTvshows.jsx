import React, { useState, useEffect } from "react";
import '../AllMovies/AllMovies.css'; 
import MovieApi from "../../API/MovieApi";
import { Link } from 'react-router-dom';

const AllTvshows = () => {
    const [tvshows, setTvshows] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [favorites, setFavorites] = useState({});
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState('');    
    const [minRating, setMinRating] = useState(''); 
    const [maxRating, setMaxRating] = useState('');
    const [genreId, setGenreId] = useState('');  
    const [isFiltered, setIsFiltered] = useState(false); 

    // Fetch available genres for the dropdown
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteTvshows')) || {};
        setFavorites(storedFavorites);
        fetchTvshows(page); 
        fetchGenres(); 
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${MovieApi.API_KEY}&language=en-US`);
            const json = await res.json();
            setGenres(json.genres || []);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const fetchTvshows = async (pageNumber) => {
        setLoading(true);
        try {
            let res = [];
            if (isFiltered) {
                res = await MovieApi.fetchTvshosByDateAndRating(startDate, endDate, minRating, maxRating, genreId, pageNumber);
            } else {
                res = await MovieApi.fetchAllTvshows(pageNumber);
            }

            const uniqueTvshows = res.filter((newShow) => 
                !tvshows.some((existingShow) => existingShow.id === newShow.id)
            );

            setTvshows((prevTvshows) => [...prevTvshows, ...uniqueTvshows]);
            setHasMore(uniqueTvshows.length > 0); 
            setPage((prevPage) => prevPage + 1);  
        } catch (error) {
            console.error("Error fetching TV shows:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        setLoading(true);
        try {
            const res = await MovieApi.fetchTvshosByDateAndRating(startDate, endDate, minRating, maxRating, genreId, 1);

            setTvshows(res);  
            setHasMore(res.length > 0);  
            setPage(2);  
            setIsFiltered(true);  
        } catch (error) {
            console.error("Error fetching TV shows by date, rating, and genre:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (show) => {
        setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites };
            if (newFavorites[show.id]) {
                delete newFavorites[show.id];
            } else {
                newFavorites[show.id] = show;
            }
            localStorage.setItem('favoriteTvshows', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const saveTvshow = (show) => {
        localStorage.setItem('tvshow', JSON.stringify(show));
    };

    return (
        <div className="moviescontainer">
            <h2>All TV Shows</h2>
            
            {/* Date, Rating, and Genre filter form */}
            <div className="date-filter">
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    placeholder="Start Date" 
                />
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    placeholder="End Date" 
                />
                <input
                    type="number"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    placeholder="Min Rating"
                    min="0"
                    max="10"
                    step="0.1"
                />
                <input
                    type="number"
                    value={maxRating}
                    onChange={(e) => setMaxRating(e.target.value)}
                    placeholder="Max Rating"
                    min="0"
                    max="10"
                    step="0.1"
                />
                
                {/* Genre Dropdown */}
                <select 
                    value={genreId}
                    onChange={(e) => setGenreId(e.target.value)}
                    className="genre-dropdown"
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>

                <button onClick={() => {
                    setTvshows([]); // Clear current TV shows
                    setPage(1);    // Reset page
                    setHasMore(true); // Reset hasMore
                    applyFilters(); // Apply filters
                }}>
                    Filter by Date, Rating & Genre
                </button>
            </div>

            <div className="movieslist">
                {tvshows.map((show) => {
                    const isFavorite = Boolean(favorites[show.id]);
                    return (
                        <div key={show.id} className="movie-item">
                            <Link to={`/tvshow-details/All`}>
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} 
                                    alt={show.name || 'TV Show Poster'} 
                                    onClick={() => saveTvshow(show)}
                                />
                            </Link>
                            <p>{show?.name}</p>
                            <p>{show.first_air_date}</p>
                            <div className="circlerating">
                                <svg className="progresscircle" viewBox="0 0 36 36">
                                    <path
                                        className="circlebg"
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
                                className={`hearticon ${isFavorite ? 'favorite' : ''}`} 
                                onClick={() => toggleFavorite(show)}
                            >
                                {isFavorite ? '❤️' : '🤍'}
                            </div>
                        </div>
                    );
                })}
            </div>
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <button className="seemorebutton" onClick={() => fetchTvshows(page)}>
                    See More
                </button>
            )}
        </div>
    );
};

export default AllTvshows;
