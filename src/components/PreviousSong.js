import axios from 'axios';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';

const skipToPrevious = async (token, deviceId) => {
    try {
        const {data} = await axios.post('https://api.spotify.com/v1/me/player/previous', 
        {
            device_ids: [
                deviceId
            ]
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

export const PreviousSong = ( {deviceId} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        skipToPrevious(token, deviceId);
    }, [])
}