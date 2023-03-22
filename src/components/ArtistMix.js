import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/ArtistMix.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';

const getTopArtists = async (setRecommendedSongs, token, current, setCurrent, topArtists) => {
    const {data} = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${topArtists[current].id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        } 
    });

    data.tracks.map(track => setRecommendedSongs(prev => 
        [
            ...prev, {
                artist: topArtists[current].name,
                title: track.name, 
                artists: track.artists.map(artist => artist.name),
                image: track.album.images.map(img => img.url),
                album: track.album.name,
                id: track.id,
                uri: track.uri,
                lengthMilliseconds: track.duration_ms,
            }
        ]
    ))
    current < 5 && setCurrent(prev => prev + 1);
}

const songLength = (durationMs) => {
    const milliseconds = durationMs / 1000;
    const toMinsSecs = `${Math.floor(milliseconds / 60) % 60}:${Math.floor(milliseconds) % 60}`;
    return toMinsSecs.split(':')[1].length > 1 ? toMinsSecs : toMinsSecs.slice(0, toMinsSecs.indexOf(':')) + ':0' + toMinsSecs.slice(-1);
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

export const ArtistMix = ( {topArtists, token, clickedArtist, setQueuedSongs, setPaused, setPlay, setCurrentSong} ) => {
    const [current, setCurrent] = useState(0);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [groupedSongs, setGroupedSongs] = useState([]);
    const [storedSongs, setStoredSongs] = useState(JSON.parse(sessionStorage.getItem('recommendedSongs')));
    const [heartColour, setHeartColour] = useState([]);
    const [showAddedSong, setShowAddedSong] = useState('');
    const [songId, setSongId] = useState('');
    const songsSorted = useRef([]);

    useEffect(() => {
        getTopArtists(setRecommendedSongs, token, current, setCurrent, topArtists);
        current === 5 && setGroupedSongs( 
            Object.values(
                recommendedSongs.reduce((acc, curr) => {
                    acc[curr.artist] = acc[curr.artist] ?? [];
                    acc[curr.artist].push(curr);
                    return acc;
                }, {})
            )
        );
    }, [current])

    useEffect(() => {
        groupedSongs.length > 0 && storedSongs === null && sessionStorage.setItem('recommendedSongs', JSON.stringify(groupedSongs));
        groupedSongs.length > 0 && storedSongs === null && setStoredSongs(JSON.parse(sessionStorage.getItem('recommendedSongs')));
    }, [groupedSongs])

    useEffect(() => {
        if (storedSongs !== null) {
            songsSorted.current = storedSongs.map(arr => arr.filter(songs => songs.artist === clickedArtist.current.name))[clickedArtist.current.index];
        }
        else {
        }
    }, [storedSongs])

    return (
        <div className='artist-mix-container'>
            <section className='artist-mix-banner'>
                <div className='artist-mix-img-container'>
                    <img className='artist-mix-img' src={clickedArtist.current.image} />
                </div>
                <div className='artist-mix-banner-info'>
                    <h2>Playlist</h2>
                    <h1>{clickedArtist.current.name} Mix</h1>
                    <p>A mix of songs based on your favourite artists</p>

                    <div className='banner-play-btn-container'>
                        <FontAwesomeIcon  
                            icon={ faPlay } 
                            className='banner-play-btn'
                            onClick={ () => {
                                setQueuedSongs(songsSorted.current);
                                setPaused(false);
                                setPlay(true);
                            }}
                        />
                    </div>
                </div>
            </section>

            <div className='artist-mix-songs-headings'>
                <p>#</p>
                <p></p>
                <p>Title & Artist</p>
                <p>Album</p>
                <p></p>
                <p>Length</p>
                <p>Play</p>
            </div>

            <ChangeHeartColour setHeartColour={setHeartColour} songs={songsSorted.current} />

            {songsSorted.current && songsSorted.current.map((song, index) => (
                <div className='artist-mix-song'>
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
                            <FaHeart className='song-liked-heart' 
                            style={ {color: 'seagreen'} } /> : 
                            <FaRegHeart className='song-liked-heart' /> 
                        }
                    </div> 

                    <p> { songLength(song.lengthMilliseconds) } </p>

                    <FontAwesomeIcon  
                        className='player-btn-icons pause-play-song' 
                        icon={ faPlay } 
                        onClick={ () => {
                            setQueuedSongs([song, ...songsSorted.current]);
                            setCurrentSong(song);
                            setPaused(false);
                            setPlay(true);
                        }}  
                    />
                </div>
            ))}

            { showAddedSong === true && <AddSongs token={token} songId={songId} />  } 
            { showAddedSong === false && songId !== '' && <DeleteSongs token={token} songId={songId} />  } 
        </div>
    )
}