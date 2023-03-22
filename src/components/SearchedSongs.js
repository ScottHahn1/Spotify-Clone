import React from 'react';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { TokenContext } from '../Contexts/TokenContext';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';

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

const getData = (data, setSongs) => {
    data.songs.map(item => setSongs(prev => 
        [
            ...prev, {
                title: item.name,
                artists: item.artists.map(artist => artist.name),
                album: item.album.name,
                image: item.album.images[2].url,
                id: item.id,
                uri: item.uri,
                lengthMilliseconds : item.duration_ms,
                length: function() {
                    const milliseconds = item.duration_ms / 1000;
                    const toMinsSecs = `${Math.floor(milliseconds / 60) % 60}:${Math.floor(milliseconds) % 60}`;
                    return toMinsSecs.split(':')[1].length > 1 ? toMinsSecs : toMinsSecs.slice(0, toMinsSecs.indexOf(':')) + ':0' + toMinsSecs.slice(-1);
                }
            }
        ]
    ))
}

export const SearchedSongs = ( {data, setQueuedSongs, setPaused, setPlay, setCurrentSong} ) => {
    const {token, setToken} = useContext(TokenContext);
    const [songs, setSongs] = useState([]);
    const [showAddedSong, setShowAddedSong] = useState(false);
    const [songId, setSongId] = useState('');
    const [heartColour, setHeartColour] = useState([]);

    useEffect(() => {
        getData(data, setSongs);
    }, [])

    return (
        <div>
            <h1>Songs</h1>
            
            <div className='searched-songs-headings'>
                <p>#</p>
                <p></p>
                <p>Title & Artist</p>
                <p>Album</p>
                <p></p>
                <p>Length</p>
                <p>Play</p>
            </div>

            <ChangeHeartColour setHeartColour={setHeartColour} songs={songs} />

            {songs.map((song, index) => (
                <div className='searched-song'>
                    <p>{index + 1}</p>
                    <img src={song.image} alt={song.title} />

                    <div className='title-artist'>
                        <h4>{song.title}</h4>
                        <p>{song.artists.join(', ')}</p>
                    </div>

                    <p>{song.album}</p>

                    <div style={ {cursor: 'pointer'} } onClick={() => {
                            addOrDeleteSong(token, setShowAddedSong, song.id, setSongId);
                            updateLikedSongs(index, heartColour, setHeartColour);
                        }}>
                        { 
                            heartColour[index] === true ? 
                            <FaHeart className='song-liked-heart' 
                            style={ {color: 'seagreen'} } /> : 
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
            )).slice(0, 4)}

            { showAddedSong === true && <AddSongs token={token} songId={songId} />  } 
            { showAddedSong === false && songId !== '' && <DeleteSongs token={token} songId={songId} />  } 
        </div>
    )
}