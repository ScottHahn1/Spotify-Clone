import { useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';
import { RecentContext } from '../Contexts/RecentContext';

const getData = async (token, setRecentSongs) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
            headers: {
                Authorization: `Bearer ${token}`
            } 
        });
        
        data.items.map(item => setRecentSongs(prev => 
            [
                ...prev, {
                    title: item.track.name,
                    artists: item.track.artists.map(artist => artist.name),
                    album: item.track.album.name,
                    id: item.track.id,
                    datePlayed: new Date(item.played_at).toDateString(),
                    timePlayed: new Date(item.played_at).toTimeString().slice(0, 8),
                    image: item.track.album.images.map(img => img.url),
                    uri: item.track.uri,
                    lengthMilliseconds: item.track.duration_ms,
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
        console.log(error.response);
    }
}

export const GetRecentlyPlayed = () => {
    const {token, setToken} = useContext(TokenContext);
    const {recentSongs, setRecentSongs} = useContext(RecentContext);

    useEffect(() => {
        token && getData(token, setRecentSongs);
    }, [token])
}