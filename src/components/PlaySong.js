import axios from 'axios';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';

const play = async (token, deviceId, queuedSongs, currentSong) => {
    const songUris = currentSong && queuedSongs.length > 0 ? queuedSongs.map(song => song.uri) : currentSong && currentSong.uri;

    try {
        songUris instanceof Array ?
        await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
            uris: [
                ...songUris
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) 
        :
        await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
            uris: [
                songUris
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) 
    }
    catch(error) {
        console.log(error);
    }
}

export const PlaySong = ( {deviceId, queuedSongs, setQueuedSongs, currentSong} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        play(token, deviceId, queuedSongs, currentSong);
    }, [currentSong])
}