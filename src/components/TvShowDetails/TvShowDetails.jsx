import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Movies/Movies.css";
import MovieApi from "../../API/MovieApi";

const TvShowDetails = () => {
  const tvshow = JSON.parse(localStorage.getItem("tvshow"));
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);
  const [visibleCastCount, setVisibleCastCount] = useState(7);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTvShowCast = async () => {
      try {
        const casting = await MovieApi.TvCast(tvshow.id);
        setCast(casting.cast || []);
      } catch (error) {
        console.error("Error fetching TV show cast:", error);
      }
    };

    // Fetch TV show details (including genres)
    const fetchTvShowDetails = async () => {
      try {
        const details = await MovieApi.fetchTvdetails(tvshow.id);
        setGenres(details.genres || []);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      }
    };

    fetchTvShowCast();
    fetchTvShowDetails();
  }, []);

  const handleShowMore = () => {
    setVisibleCastCount((prevCount) => prevCount + 7);
  };
  const go_back = () => {
    navigate(-1);
  };
  return (
    <div className="details-container">
      <div className="details-image">
        <img
          src={`https://image.tmdb.org/t/p/w500/${tvshow.poster_path}`}
          alt={tvshow.title || tvshow.name}
        />
      </div>
      <div className="details-content">
        <h1>
          {tvshow.title || tvshow.name} (
          {new Date(tvshow.release_date || tvshow.first_air_date).getFullYear()}
          )
        </h1>
        <p>
          <strong>R</strong> | {tvshow.release_date || tvshow.first_air_date} |
          {genres.map((genre) => genre.name).join(", ")} {/* Display genres */}
        </p>
        <div className="user-score">
          <span>User Score: {Math.round(tvshow.vote_average * 10)}%</span>
        </div>
        <h2>Overview</h2>
        <p>{tvshow.overview}</p>
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
      <button className="close-button" onClick={go_back}>
        ×
      </button>
    </div>
  );
};

export default TvShowDetails;
