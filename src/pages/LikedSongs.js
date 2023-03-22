import React from 'react';
import axios from 'axios';
import '../styles/LikedSongs.css';
import { useContext, useEffect, useState } from 'react';
import { LikedContext } from '../Contexts/LikedContext';
import { GetLikedSongs } from '../components/GetLikedSongs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';
import { TokenContext } from '../Contexts/TokenContext';

const addOrDeleteSong = async (token, setShowAddedSong, songId, setSongId) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${songId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        data[0] ? setShowAddedSong(false) : setShowAddedSong(true);
        setSongId(songId);
    }
    catch (error) {
        console.log(error);
    }
}

const updateLikedSongs = (index, heartColour, setHeartColor) => {
    const newState = heartColour.map((item, i) => {
        if (i === index) {
            return !item
        }
        else {
            return item
        }
    });
    setHeartColor(newState);
}

export const LikedSongs = ( {setQueuedSongs, setPaused, setPlay, setCurrentSong} ) => {
    const {token, setToken} = useContext(TokenContext);
    const {songs, setSongs} = useContext(LikedContext);
    const [showAddedSong, setShowAddedSong] = useState('');
    const [songId, setSongId] = useState('');
    const [heartColour, setHeartColour] = useState([]);

    useEffect(() => {
        setSongs(songs.slice(songs.length));
    }, [])

    return (
        <div className='liked-songs-container'>
            <GetLikedSongs token={token}  />
            
            <section className='liked-songs-banner'>
                <div id='heart-container'>
                    <div id='heart'>
                        <FaHeart id='banner-heart' /> 
                    </div>
                </div>
                <div className='liked-songs-banner-info'>
                    <h1>Liked Songs</h1>
                    <h3>{songs.length} songs</h3>
                    <p>Your favourite songs</p>

                    <div className='banner-play-btn-container'>
                        <FontAwesomeIcon  
                            icon={ faPlay } 
                            className='banner-play-btn'
                            onClick={ () => {
                                setQueuedSongs(songs);
                                setPaused(false);
                                setPlay(true);
                            }}
                        />
                    </div>
                </div>
            </section>

            <div className='liked-songs-headings'>
                <p>#</p>
                <p></p>
                <p>Title & Artist</p>
                <p>Album</p>
                <p>Date Added</p>
                <p></p>
                <p>Length</p>
                <p>Play</p>
            </div>

            <ChangeHeartColour setHeartColour={setHeartColour} songs={songs} />

            {
                songs.map((song, index) => (
                    <div className='liked-song'>
                        <p>{index + 1}</p>
                        <img src={song.image} alt={song.title} />

                        <div className='title-artist'>
                            <h4>{song.title}</h4>
                            <p>{song.artists.join(', ')}</p>
                        </div>

                        <p>{song.album}</p>
                        <p>{song.dateAdded}</p>

                        <div style={ {cursor: 'pointer'} } onClick={() => {
                                addOrDeleteSong(token, setShowAddedSong, song.id, setSongId);
                                updateLikedSongs(index, heartColour, setHeartColour);
                            }}>
                            { 
                                heartColour[index] === true ? 
                                <FaHeart className='song-liked-heart' style={ {color: 'seagreen'} } /> : 
                                <FaRegHeart className='song-liked-heart' /> 
                            }
                        </div>

                        <p>{song.length()}</p>

                        <FontAwesomeIcon  
                            className='player-btn-icons pause-play-song' 
                            icon={ faPlay } 
                            onClick={ () => { 
                                setQueuedSongs( [song, ...songs] );
                                setCurrentSong(song);
                                setPaused(false);
                                setPlay(true);
                            }}  
                        />
                    </div>
                ))
            }

            { showAddedSong && <AddSongs token={token} songId={songId} />  } 
            { !showAddedSong && songId !== '' && <DeleteSongs token={token} songId={songId} />  } 
        </div>
    )
}