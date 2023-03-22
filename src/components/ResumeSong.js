import axios from 'axios';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';

const play = (token, deviceId) => {
    try {
       axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
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

export const ResumeSong = ( {deviceId} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        play(token, deviceId);
    }, [])
}