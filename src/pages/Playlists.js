import { useState, useContext, useEffect } from 'react';
import '../styles/Playlists.css';
import { Link } from 'react-router-dom';
import { GetPlaylists } from '../components/GetPlaylists';
import { FaMusic } from 'react-icons/fa';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const getPlaylistsSongs = async (token, playlist, setSongs) => {
    setSongs([]);

    const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    data.items.map(item => setSongs(prev =>
        [
            ...prev, {
                title: item.track.name,
                album: item.track.album.name,
                artists: item.track.artists.map(artist => artist.name), 
                dateAdded: new Date(item.added_at).toDateString(),
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

export const Playlists = ( {queuedSongs, setQueuedSongs, setPaused, setPlay, selectedPlaylist} ) => {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const {token} = useContext(TokenContext);
    const [songsLoading, setSongsLoading] = useState(true);

    useEffect(() => {
        songs.length && setQueuedSongs(songs);
        songs.length && setSongsLoading(false);
    }, [songs])

    useEffect(() => {
        !songsLoading && setPaused(false);
        !songsLoading && setPlay(true); 
    }, [songsLoading])

    return (
        <div className='playlist-container'>
            <GetPlaylists playlists={playlists} setPlaylists={setPlaylists} songs={songs} setSongs={setSongs} /> 
            
            {
                playlists.map(playlist => (
                    <Link to='/playlists'>
                        <div className='playlist' onClick={ () => selectedPlaylist.current = playlist }>
                            <div className='playlist-img'>
                                {playlist.image !== null ? <img src={playlist.image} width={'100%'} height={'100%'} alt={playlist.title} /> : <FaMusic id='fa-music' /> }
                            </div>
                            <h4>{playlist.title}</h4>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}