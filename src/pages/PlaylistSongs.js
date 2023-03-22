import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaMusic } from 'react-icons/fa';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ChangeHeartColour } from '../components/ChangeHeartColour';

const getSongs = async (token, selectedPlaylist, setSongs) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylist.current.id}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        data.items.map(item => setSongs(prev => 
            [
                ...prev, {
                    title: item.track.name,
                    artists: item.track.artists.map(artist => artist.name),
                    album: item.track.album.name,
                    dateAdded: new Date(item.added_at).toDateString(),
                    id: item.track.id,
                    image: item.track.album.images.map(img => img.url),
                    uri: item.track.uri,
                    lengthMilliseconds : item.track.duration_ms,
                    length: function() {
                        const milliseconds = item.track.duration_ms / 1000;
                        const toMinsSecs = `${Math.floor(milliseconds / 60) % 60}:${Math.floor(milliseconds) % 60}`;
                        return toMinsSecs.split(':')[1].length > 1 ? toMinsSecs : toMinsSecs.slice(0, toMinsSecs.indexOf(':')) + ':0' + toMinsSecs.slice(-1);
                    }
                }
            ]
        ))
    }

    catch(error) {
        console.log(error);
    }
}

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

export const PlaylistSongs = ( {selectedPlaylist, setQueuedSongs, setCurrentSong, setPaused, setPlay} ) => {
    const {token} = useContext(TokenContext);
    const [songs, setSongs] = useState([]);
    const [showAddedSong, setShowAddedSong] = useState(false);
    const [songId, setSongId] = useState('');
    const [heartColour, setHeartColour] = useState([]);

    useEffect(() => {
        getSongs(token, selectedPlaylist, setSongs);
    }, [])

    return (
        <div className='artist-songs-albums'>
            <section className='playlist-songs-banner'>
                {selectedPlaylist.current.image !== null ? 
                <img 
                    src={selectedPlaylist.current.image} 
                    className='playlist-songs-img' 
                    alt='Playlist' 
                /> 
                : 
                <FaMusic id='fa-music' /> }

                <div className='playlist-songs-banner-info'>
                    <h4>Playlist</h4>
                    <h1>{selectedPlaylist.current.title}</h1>
                    <p>{selectedPlaylist.current.description}</p>

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

            {/* <h3>Popular Songs</h3> */}

            <div className='playlist-songs-container'>
                <div className='playlist-songs-headings'>
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
                        <div className='playlist-song'>
                            <p>{index + 1}</p>
                            <img src={song.image[2]} alt={song.title} />

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
                                }
                                }  
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}