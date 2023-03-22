import React from 'react';
import '../styles/Library.css';
import { useContext, useEffect, useState } from 'react';
import { GetLikedSongs } from './GetLikedSongs';
import { LikedContext } from '../Contexts/LikedContext';
import { TokenContext } from '../Contexts/TokenContext';
import { Artists } from '../pages/Artists';
import { Albums } from '../pages/Albums';
import { Playlists } from '../pages/Playlists';

export const Library = ( {setQueuedSongs, setPaused, setPlay, selectedArtist, selectedAlbum, selectedPlaylist} ) => {
    const {songs, setSongs} = useContext(LikedContext);
    const {token, setToken} = useContext(TokenContext);
    const [showPage, setShowPage] = useState('playlists');

    useEffect(() => {
        setSongs(songs.slice(songs.length));
    }, [])

    const changePageShown = () => {
        if (showPage === 'playlists') {
            return <Playlists setQueuedSongs={setQueuedSongs} setPaused={setPaused} setPlay={setPlay} selectedPlaylist={selectedPlaylist} />
        }
        else if (showPage === 'artists') {
            return <Artists selectedArtist={selectedArtist} />
        }
        else {
            return <Albums selectedAlbum={selectedAlbum} />
        }
    }

    return (
        <div className='library-container'>

            <div className='library-nav-container'>
                <div className='library-nav'>
                    
                    <div className='playlists-nav' onClick={() => setShowPage('playlists')}>
                        <h4>Playlists</h4>
                    </div>
                    <div className='artists-nav' onClick={() => setShowPage('artists')}>
                        <h4>Artists</h4>
                    </div>
                    <div className='albums-nav' onClick={() => setShowPage('albums')}>
                        <h4>Albums</h4>
                    </div>
                </div>
            </div>

            <div className='library-content'>
                <GetLikedSongs token={token} />

                <div className='library-liked-songs'>
                    <h1>Liked Songs</h1>
                    <h4>{songs.length} liked songs</h4>
                </div>

                {changePageShown()}
            </div>
        </div>
    )
}