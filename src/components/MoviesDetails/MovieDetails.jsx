import React, { useState, useEffect } from "react";
// import '../Movies/Movies.css';
import MovieApi from "../../API/MovieApi";
import { Link, useParams } from "react-router-dom";

const MovieDetails = () => {
    const [trailer, setTrailer] = useState(false);
    const movie = JSON.parse(localStorage.getItem('movie'));
    const [youtubeLink, setYoutubeLink] = useState("");
    const { category } = useParams() || "default";
    const [link, setLink] = useState("");
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);
    const [visibleCastCount, setVisibleCastCount] = useState(7); // State to manage visible cast count

    useEffect(() => {
        // Set the link based on the category
        if (category === "popular") {
            setLink("/movies/popular");
        } else if (category === "fav") {
            setLink("/favorite");
        } else if (category === "now_playing") {
            setLink("/movies/now_playing");
        } else if (category === "upcoming") {
            setLink("/movies/upcoming");
        } else if (category === "top_rated") {
            setLink("/movies/top_rated");
        }else if(category === "All"){
            setLink("/AllMovies");
        } 
        else {
            setLink("/");
        }

    }, [movie, category]);
    
   useEffect(()=>{
    const fetchMovieTrailer = async () => {
            try {
                const trailerLink = await MovieApi.getYoutubeTrailerLink(movie);
                setYoutubeLink(trailerLink);
            } catch (error) {
                console.error("Error fetching movie trailer:", error);
            }
        };

        fetchMovieTrailer();
   },[movie])
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const details = await MovieApi.fetchmoviedetails(movie.id);
                setGenres(details.genres || []); 
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [movie]);

    useEffect(() => {
        const fetchMovieCast = async () => {
            try {
                const casting = await MovieApi.movieCast(movie.id);
                setCast(casting.cast || []); 
            } catch (error) {
                console.error("Error fetching movie cast:", error);
            }
        };

        fetchMovieCast();
    }, [movie]);

    // Handle "Show More" click
    const handleShowMore = () => {
        setVisibleCastCount(prevCount => prevCount + 7);
    };
    
    return (
        <div className="details-container">
            <div className="details-image">
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title || movie.name}
                />
            </div>
            <div className="details-content">
                <h1>{movie.title || movie.name} ({new Date(movie.release_date || movie.first_air_date).getFullYear()})</h1>
                <p>
                    <strong>R</strong> | {movie.release_date || movie.first_air_date} | 
                    {genres.map((genre) => genre.name).join(', ')}
                </p>
                <div className="user-score">
                    <span>User Score: {Math.round(movie.vote_average * 10)}%</span>
                </div>
                <h2>Overview</h2>
                <p>{movie.overview}</p>
                <button className="play-trailer" onClick={() => setTrailer(!trailer)}>
                    {trailer ? 'Hide Trailer' : 'Play Trailer'}
                </button>
            </div>
            
            {/* Cast Section */}
            <div className="cast-container">
                <h2>Cast</h2>
                <div className="cast-list">
                    {cast.slice(0, visibleCastCount).map((member) => (
                        <div key={member.cast_id} className="cast-member">
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${member.profile_path}`}
                                alt={member.name}
                                className="cast-profile"
                            />
                            <div className="cast-details">
                                <p className="cast-name">{member.name}</p>
                                <p className="cast-character">as {member.character}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {visibleCastCount < cast.length && (
                    <button onClick={handleShowMore} className="show-more-button">
                        Show More
                    </button>
                )}
            </div>

            {trailer && youtubeLink && (
                <div className="trailer-container">
                    <iframe
                        width="560"
                        height="315"
                        src={youtubeLink.replace('watch?v=', 'embed/')}
                        title="YouTube video player"
                        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        // allowFullScreen
                    ></iframe>
                    <button onClick={() => setTrailer(!trailer)}>Finish</button>
                </div>
            )}
            <Link to={link}>
                <button className="close-button">×</button>
            </Link>
        </div>
    );
};

export default MovieDetails;
