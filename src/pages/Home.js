import React from 'react';
import { useContext, useState } from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import { TokenContext } from '../Contexts/TokenContext';
import { GetTopArtists } from '../components/GetTopArtists';
import { GetRecentlyPlayed } from '../components/GetRecentlyPlayed';
import { FaHeart } from 'react-icons/fa';
import { RecentContext } from '../Contexts/RecentContext';
import { GetFeatured } from '../components/GetFeatured';
import { GetPopular } from '../components/GetPopular';

const changeClickedArtist = (clickedArtist, name, index, image) => {
    clickedArtist.current = { name, index, image }
}

export const Home = ( { topArtists, setTopArtists, clickedArtist, clickedCategory, featured, setFeatured, selectedPlaylist } ) => {
    const {token, setToken} = useContext(TokenContext);
    const {recentSongs, setRecentSongs} = useContext(RecentContext);
    const [popularFiltered, setPopularFiltered] = useState([]);

    return (
        token &&
        <div className='home'>
            <GetRecentlyPlayed />

            <GetTopArtists token={token} setTopArtists={setTopArtists} /> 

            <div className='recommended-container'>
                <h2>Artist Mix</h2>
                <div className='recommended'>
                    {
                        topArtists.map((artist, index) => 
                            <Link to='/artist-mix'>
                                <div className='recommended-artist' onClick={ () => changeClickedArtist(clickedArtist, artist.name, index, artist.image) }>
                                    <img className='artist-mix-img' src={artist.image} alt={artist.name} />
                                    <p>{artist.name} Mix</p>
                                </div>
                            </Link>
                        ).slice(0, 5)
                    }
                </div>
            </div>

            <div className='made-for-you-container' > 
                <h2>Made For You</h2> 
                <div className='made-for-you'> 
                <Link to='/recently-played'>
                    <div className='recently-played'>
                        { recentSongs.length > 0 && <img src={recentSongs[0].image[1]} className='recently-played-img' /> }
                        <p>Recently Played</p>
                    </div>
                </Link>
                
                <Link to='/on-repeat'>
                    <div className='on-repeat'>
                        <img className='on-repeat-img' src='https://daily-mix.scdn.co/covers/on_repeat/PZN_On_Repeat2_LARGE-en.jpg' />
                        <p>On Repeat</p>
                    </div>
                </Link>

                <Link to='/liked-songs'>
                    <div className='home-liked-container'>
                        <div className='home-liked'>
                            <FaHeart className='home-liked-heart' /> 
                            <p>Liked Songs</p>
                        </div>
                    </div>
                </Link>
                </div>
            </div>

            <GetPopular setPlaylistsFiltered={setPopularFiltered} />

            <div className='featured-container'>
                <h2>Popular</h2>
                <div className='featured'>
                    {
                        popularFiltered.map((item, index) => 
                            <Link to='/playlists'>
                                <div className='featured-playlist' onClick={ () => selectedPlaylist.current = item } >
                                    <img className='featured-img' src={item.image} alt={item.title} />
                                    <p>{item.title}</p>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>

            <GetFeatured setFeatured={setFeatured} />

            <div className='featured-container'>
                <h2>Featured</h2>
                <div className='featured'>
                    {
                        featured.map((item, index) => 
                            <Link to='/playlists'>
                                <div className='featured-playlist' onClick={ () => selectedPlaylist.current = item } >
                                    <img className='featured-img' src={item.image} alt={item.title} />
                                    <p>{item.title}</p>
                                </div>
                            </Link>
                        ).slice(0, 10)
                    }
                </div>
            </div>
        </div> 
    )
}