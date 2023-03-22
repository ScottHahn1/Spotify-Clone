import axios from 'axios';
import { useEffect, useContext } from 'react';
import { TokenContext } from '../Contexts/TokenContext';

const pause = (token, deviceId) => {
    try {
        axios.put('https://api.spotify.com/v1/me/player/pause', 
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

export const PauseSong = ( {deviceId} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        pause(token, deviceId);
    }, [])
}