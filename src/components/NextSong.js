import axios from 'axios';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';

const skipToNext = async (token, deviceId) => {
    try {
        await axios.post('https://api.spotify.com/v1/me/player/next', 
        {
            device_ids: [
                deviceId
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    catch(error) {
        console.log(error);
    }
}

export const NextSong = ( {deviceId, queuedSongs, setQueuedSongs} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        setQueuedSongs(queuedSongs.slice(1, -1));
        skipToNext(token, deviceId);
    }, [])
}