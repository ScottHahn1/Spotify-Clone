import { useState, useEffect, useContext } from 'react';
import '../styles/RecentlyPlayed.css';
import axios from 'axios';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';
import { FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { GetRecentlyPlayed } from '../components/GetRecentlyPlayed';
import { TokenContext } from '../Contexts/TokenContext';
import { RecentContext } from '../Contexts/RecentContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

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

export const RecentlyPlayed = ( {setCurrentSong, setPaused, setPlay, setQueuedSongs} ) => {
    const [showAddedSong, setShowAddedSong] = useState('');
    const [songId, setSongId] = useState('');
    const [heartColour, setHeartColour] = useState([]);
    const {recentSongs, setRecentSongs} = useContext(RecentContext);
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        setRecentSongs(recentSongs.slice(recentSongs.length));
    }, [])
    
    return (
        <div className='recently-played-container'>
            <GetRecentlyPlayed  />

            <section className='recently-played-banner'>
                <div id='heart-container'>
                    <FaMusic id='fa-music' />
                </div>
                <div className='recently-played-banner-info'>
                    <h3>Playlist</h3>
                    <h1>Recently Played</h1>
                    <p>Songs that you last listened to.</p>
                    
                    <div className='banner-play-btn-container'>
                        <FontAwesomeIcon  
                            icon={ faPlay } 
                            className='banner-play-btn'
                            onClick={ () => {
                                setQueuedSongs(recentSongs);
                                setPaused(false);
                                setPlay(true);
                            }}
                        />
                    </div>
                </div>
            </section>

            <div className='songs-headings'>
                <p>#</p>
                <p></p>
                <p>Title & Artist</p>
                <p>Album</p>
                <p>Played At</p>
                <p></p>
                <p>Length</p>
                <p>Play</p>
            </div>

            <ChangeHeartColour setHeartColour={setHeartColour} songs={recentSongs} />

            {recentSongs.length > 0 && heartColour.length > 0 && recentSongs.map((song, index) => (
                <div className='recent-song'>
                    <p>{index + 1}</p>
                    <img src={song.image[2]} alt={song.album} />

                    <div className='title-artist'>
                        <h4>{song.title}</h4>
                        <p>{song.artists.join(', ')}</p>
                    </div>

                    <p>{song.album}</p>
                    <p>{song.datePlayed} @ {song.timePlayed}</p>

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
                            setQueuedSongs( [song, ...recentSongs] ); 
                            setCurrentSong(song);
                            setPaused(false);
                            setPlay(true);
                        }}  
                    />
                </div>
            ))}

            { showAddedSong && <AddSongs token={token} songId={songId} />  } 
            { !showAddedSong && songId !== '' && <DeleteSongs token={token} songId={songId} />  } 
        </div>
    )
}