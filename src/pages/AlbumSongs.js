import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';

const getSongs = async (token, selectedAlbum, setSongs) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/albums/${selectedAlbum.current.id}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        data.items.map(item => setSongs(prev => 
            [
                ...prev, {
                    title: item.name,
                    artists: item.artists.map(artist => artist.name),
                    dateAdded: new Date(item.added_at).toDateString(),
                    id: item.id,
                    image: selectedAlbum.current.image,
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

export const AlbumSongs = ( {selectedAlbum, setQueuedSongs, setCurrentSong, setPaused, setPlay} ) => {
    const {token} = useContext(TokenContext);
    const [songs, setSongs] = useState([]);
    const [showAddedSong, setShowAddedSong] = useState('');
    const [songId, setSongId] = useState('');
    const [heartColour, setHeartColour] = useState([]);

    useEffect(() => {
        getSongs(token, selectedAlbum, setSongs);
    }, [])

    return (
        <div className='album-songs'>
            <section className='album-songs-banner'>
                <div className='album-songs-img-container'>
                    <img className='album-songs-img' src={selectedAlbum.current.image[1]} alt={selectedAlbum.current.name} />
                </div>

                <div className='album-songs-banner-info'>
                    <h4>Album</h4>
                    <h1>{selectedAlbum.current.name}</h1>
                    <h4>
                        {selectedAlbum.current.artist.join(', ')} &#x2022; &nbsp;
                        {selectedAlbum.current.releaseDate} &#x2022; &nbsp;
                        {selectedAlbum.current.songTotal} songs
                    </h4>

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

            <div className='album-songs-headings'>
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
                <div className='album-song'>
                    <p>{index + 1}</p>
                    <img src={selectedAlbum.current.image[2]} alt={song.title} />

                    <div className='title-artist'>
                        <h4>{song.title}</h4>
                        <p>{song.artists.join(', ')}</p>
                    </div>

                    <p>{selectedAlbum.current.name}</p>

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
            ))}

            { showAddedSong && <AddSongs token={token} songId={songId} />  } 
            { !showAddedSong && songId !== '' && <DeleteSongs token={token} songId={songId} />  } 
        </div>
    )
}