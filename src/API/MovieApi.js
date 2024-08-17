const API_KEY = '56f0005afc90fa96142c81078257bec8';
////////////////////////////////////////////////////////////////////////////////////////
const fetchMovies = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`);
  const json = await res.json();
  return json.results || [];
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchAllMovies = async (page = 1) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        return json.results || [];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};
/////////////////////////////////////////////////////////////////////////////////////
const fetchAllTvshows = async (page = 1) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${page}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        return json.results || [];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};
/////////////////////////////////////////////////////////////////////////////////////
const fetchMoviesByDateAndRating = async (startDate, endDate, minRating, maxRating, genreId, page = 1) => {
  try {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`;
    
    if (minRating) {
      url += `&vote_average.gte=${minRating}`;
    }
    if (maxRating) {
      url += `&vote_average.lte=${maxRating}`;
    }
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json.results || [];
  } catch (error) {
    console.error("Error fetching movies by date, rating, and genre:", error);
    return [];
  }
};

/////////////////////////////////////////////////////////////////////////////////////
const fetchTvshosByDateAndRating = async (startDate, endDate, minRating, maxRating, genreId, page = 1) => {
  try {
    let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&page=${page}`;
    
    if (minRating) {
      url += `&vote_average.gte=${minRating}`;
    }
    if (maxRating) {
      url += `&vote_average.lte=${maxRating}`;
    }
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json.results || [];
  } catch (error) {
    console.error("Error fetching TV shows by date, rating, and genre:", error);
    return [];
  }
};


////////////////////////////////////////////////////////////////////////////////////////
const fetchPopularMovies = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  const json = await res.json();
  return json.results || [];
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchNowPlayingMovies = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`);
  const json = await res.json();
  return json.results || [];
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchUpcomingMovies = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);
  const json = await res.json();
  return json.results || [];
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchTopRatedMovies = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
  const json = await res.json();
  return json.results || [];
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchTvshows = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}`);
  const json = await res.json();
  return json.results || [];
};
////////////////////////////////////////////////////////////////////////////////////////
const getYoutubeTrailerLink = async (data) => {
  try { 
    const res = await fetch(`https://api.themoviedb.org/3/${data.media_type || 'movie'}/${data.id}/videos?api_key=${API_KEY}`);
    const json = await res.json();
    const video = json.results.find((vid) => vid.site === 'YouTube');
    // console.log(video)
    if (video) {
      const youtubeLink = `https://www.youtube.com/watch?v=${video.key}`;
      return youtubeLink;
    } else {
      return 'Trailer not available';
    }
  } catch (error) {
    console.error('Failed to fetch trailer:', error);
    return 'Failed to fetch trailer';
  }
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchmoviedetails = async (id) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmYwMDA1YWZjOTBmYTk2MTQyYzgxMDc4MjU3YmVjOCIsIm5iZiI6MTcyMzI4MzU4NC44OTg0NzgsInN1YiI6IjY2YjczMzI4NmNjOWVlN2RjMDllZGM4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ULU8yJL3ZtJnqk_SOV5FleIRjVv_gheQjjGm_BxQN_M'
    }
  };

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
    const json = await res.json();
    return json; 
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null; 
  }
};
////////////////////////////////////////////////////////////////////////////////////////
const movieCast = async (id) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmYwMDA1YWZjOTBmYTk2MTQyYzgxMDc4MjU3YmVjOCIsIm5iZiI6MTcyMzI4MzU4NC44OTg0NzgsInN1YiI6IjY2YjczMzI4NmNjOWVlN2RjMDllZGM4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ULU8yJL3ZtJnqk_SOV5FleIRjVv_gheQjjGm_BxQN_M'
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching movie cast:', error);
    return null; 
  }
};
////////////////////////////////////////////////////////////////////////////////////////
const fetchsearch = async (value) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmYwMDA1YWZjOTBmYTk2MTQyYzgxMDc4MjU3YmVjOCIsIm5iZiI6MTcyMzgxNzg1Ni43MTU5NDcsInN1YiI6IjY2YjczMzI4NmNjOWVlN2RjMDllZGM4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pcbiSprriYtnZXDlKk3-f2LhjlGsXMvzvptttYlETVM'
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${value}
`, options);
    const data = await response.json();
    return data.results;  // Return the search results
  } catch (err) {
    console.error('Error fetching search results:', err);
    return [];  // Return an empty array in case of an error
  }
};

////////////////////////////////////////////////////////////////////////////////////////
export default{
    fetchMovies,
    fetchTvshows,
    getYoutubeTrailerLink,
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTopRatedMovies,
    fetchmoviedetails,
    movieCast,
    fetchAllMovies,
    fetchMoviesByDateAndRating,
    API_KEY,
    fetchsearch,
    fetchTvshosByDateAndRating,
    fetchAllTvshows

}