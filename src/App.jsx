import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Movies from './components/Movies/Movies';
import Tvshows from './components/TvShows/Tvshows';
import MovieDetails from './components/MoviesDetails/MovieDetails';
import TvShowDetails from './components/TvShowDetails/TvShowDetails';
import FavoriteMovies from './components/FavoriteMovies/FavoriteMovies';
import FavoriteTvshows from './components/FavoriteTvshows/FavoriteTvshows';
import AllMovies from './components/AllMovies/AllMovies';
import AllTvshows from './components/AllTvshows/AllTvshows';
const App = ()=>{
    return(
        <BrowserRouter>
        <main>
        <Navbar/>
        
        <Routes>
    <Route path="/" element={<><Movies/><Tvshows/></>} />
    <Route path="/movies/:category" element={<Movies/>} />
    <Route path="/movie-details/:category" element={<MovieDetails/>} />
    <Route path="/tvshow-details/:category" element={<TvShowDetails/>} />
    <Route path="/favorite" element={<><FavoriteMovies/><FavoriteTvshows/></>}/>
    <Route path='/AllMovies/' element={<AllMovies/>}/>
    <Route path='/AllTvshows' element={<AllTvshows/>}/>

</Routes>
        </main>
        </BrowserRouter>
    )
}
export default App;