import React, { useState, useEffect } from "react";
import './AllMovies.css'; 
import MovieApi from "../../API/MovieApi";
import { Link } from 'react-router-dom';

const AllMovies = () => {
    const [movies, setMovies] = useState([]);
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
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || {};
        setFavorites(storedFavorites);
        fetchMovies(page); 
        fetchGenres(); 
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${MovieApi.API_KEY}&language=en-US`);
            const json = await res.json();
            setGenres(json.genres || []);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const fetchMovies = async (pageNumber) => {
        setLoading(true);
        try {
            let res = [];
            if (isFiltered) {
                
                res = await MovieApi.fetchMoviesByDateAndRating(startDate, endDate, minRating, maxRating, genreId, pageNumber);
            } else {
                res = await MovieApi.fetchAllMovies(pageNumber);
            }

            
            const uniqueMovies = res.filter((newMovie) => 
                !movies.some((existingMovie) => existingMovie.id === newMovie.id)
            );

            setMovies((prevMovies) => [...prevMovies, ...uniqueMovies]);
            setHasMore(uniqueMovies.length > 0); 
            setPage((prevPage) => prevPage + 1);  
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        setLoading(true);
        try {
            const res = await MovieApi.fetchMoviesByDateAndRating(startDate, endDate, minRating, maxRating, genreId, 1);

            setMovies(res);  // Replace existing movies with filtered ones
            setHasMore(res.length > 0);  // Set hasMore based on filtered results
            setPage(2);  // Start pagination from the second page for the next fetch
            setIsFiltered(true);  // Set filter flag
        } catch (error) {
            console.error("Error fetching movies by date, rating, and genre:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (movie) => {
        setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites };
            if (newFavorites[movie.id]) {
                delete newFavorites[movie.id];
            } else {
                newFavorites[movie.id] = movie;
            }
            localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const saveMovie = (movie) => {
        localStorage.setItem('movie', JSON.stringify(movie));
    };

    return (
        <div className="moviescontainer">
            <h2>All Movies</h2>
            
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
                    setMovies([]); // Clear current movies
                    setPage(1);    // Reset page
                    setHasMore(true); // Reset hasMore
                    applyFilters(); // Apply filters
                }}>
                    Filter by Date, Rating & Genre
                </button>
            </div>

            <div className="movieslist">
                {movies.map((movie) => {
                    const isFavorite = Boolean(favorites[movie.id]);
                    return (
                        <div key={movie.id} className="movie-item">
                            <Link to={`/movie-details/All`}>
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
                                    alt={movie.title || 'Movie Poster'} 
                                    onClick={() => saveMovie(movie)}
                                />
                            </Link>
                            <p>{movie?.title}</p>
                            <p>{movie.release_date}</p>
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
                                        strokeDasharray={`${movie.vote_average * 10}, 100`}
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="percentage">{movie.vote_average}</text>
                                </svg>
                            </div>
                            <div 
                                className={`hearticon ${isFavorite ? 'favorite' : ''}`} 
                                onClick={() => toggleFavorite(movie)}
                            >
                                {isFavorite ? '❤️' : '🤍'}
                            </div>
                        </div>
                    );
                })}
            </div>
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <button className="seemorebutton" onClick={() => fetchMovies(page)}>
                    See More
                </button>
            )}
        </div>
    );
};

export default AllMovies;
