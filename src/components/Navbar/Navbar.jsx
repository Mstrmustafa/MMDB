import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import MovieApi from "../../API/MovieApi";

function Navbar(props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const savemovie = (movie) => {
    localStorage.setItem("movie", JSON.stringify(movie));
  };

  const fetchSearch = async () => {
    if (search.trim() !== "") {
      try {
        const results = await MovieApi.fetchsearch(search);
        setData(results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setData([]);
      }
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchSearch();
  }, [search]);

  return (
    <div className="navbar">
      <section className="left-bar">
        <Link to="/">
          <h1>
            M M D B <br /> MSAMEH{" "}
          </h1>
        </Link>
      </section>
      <section className="right-bar">
        <button
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
        <ul className={`nav-list ${isMobileMenuOpen ? "open" : ""}`}>
          <li className="nav-item">
            <Link to={"/AllTvshows"}>Tv shows</Link>
          </li>
          <li className="nav-item">
            <Link to={"/favorite"}>Favorite</Link>
          </li>
          <li className="nav-item dropdown">
            <Link to={"/AllMovies"}>
              <p className="dropdown-toggle">All Movies</p>
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/movies/popular">Popular</Link>
              </li>
              <li>
                <Link to="/movies/now_playing">Now Playing</Link>
              </li>
              <li>
                <Link to="/movies/upcoming">Upcoming</Link>
              </li>
              <li>
                <Link to="/movies/top_rated">Top Rated</Link>
              </li>
            </ul>
          </li>
        </ul>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={search}
          name="search"
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Display search results */}
        {data && data.length > 0 && (
          <div className="search-results">
            <ul>
              {data.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    savemovie(item);
                    setSearch("");
                  }}
                >
                  <Link to={`/movie-details`}>
                    {item.name || item.title} {/* Display name or title */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default Navbar;
