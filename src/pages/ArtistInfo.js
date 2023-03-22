import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';

const getSongs = async (token, selectedArtist, setSongs) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/artists/${selectedArtist.current.id}/top-tracks?market=SA`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
 
        data.tracks.map(track => setSongs(prev => 
            [
                ...prev, {
                    title: track.name,
                    artists: track.artists.map(artist => artist.name),
                    album: track.album.name,
                    dateAdded: new Date(track.added_at).toDateString(),
                    id: track.id,
                    image: track.album.images.map(img => img.url),
                    uri: track.uri,
                    lengthMilliseconds : track.duration_ms,
                    length: function() {
                        const milliseconds = track.duration_ms / 1000;
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

const getAlbums = async (token, selectedArtist, setAlbums) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/artists/${selectedArtist.current.id}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        data.items.map(item => setAlbums(prev => 
            [
                ...prev, {
                    name: item.name,
                    artists: item.artists.map(x => x.name),
                    image: item.images[0].url
                }
            ]
        ));
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

export const ArtistInfo = ( {selectedArtist, setQueuedSongs, setCurrentSong, setPaused, setPlay} ) => {
    const {token} = useContext(TokenContext);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [showAddedSong, setShowAddedSong] = useState('');
    const [songId, setSongId] = useState('');
    const [heartColour, setHeartColour] = useState([]);

    useEffect(() => {
        getSongs(token, selectedArtist, setSongs);
        getAlbums(token, selectedArtist, setAlbums);
    }, [])

    return (
        <div className='artist-songs-albums'>
            <section className='artist-songs-albums-banner'>
                <div className='artist-songs-albums-img-container'>
                    <img className='artist-songs-albums-img' src={selectedArtist.current.image} />
                </div>
              
                <div className='artist-songs-albums-banner-info'>
                    <h1>{selectedArtist.current.name}</h1>
                    <h4>Followers: {selectedArtist.current.followers}</h4>
                </div>
            </section>

            <h3>Popular Songs</h3>

            <div className='artist-songs-container'>
                <div className='artist-songs-headings'>
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
                    <div className='artist-song'>
                        <p>{index + 1}</p>
                        <img src={song.image[2]} alt={song.title} />

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
                                <FaHeart className='song-liked-heart' style={ {color: 'seagreen'} } /> : 
                                <FaRegHeart className='song-liked-heart' /> 
                            }
                        </div>

                        <p>{song.length()}</p>

                        <FontAwesomeIcon  
                            className='player-btn-icons pause-play-song' 
                            icon={ faPlay } 
                            onClick={ () => { 
                                setQueuedSongs([]);
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

            <h3>Albums</h3>
            <div className='artist-albums-container'>
                {
                    albums.map((album, index) => (
                        <div className='artist-albums'>
                            <img className='followed-albums-img' src={album.image} alt={album.name} />
                            <h4>{album.name}</h4>
                            <p>{album.artists.join(', ')}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}