import { useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const setColour = async (token, setHeartColour, songs) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${songs.slice(0, 49).map(song => song.id)}&limit=50`, {
            headers: {
                Authorization: `Bearer ${token}`
            } 
        });
        data.map(dt => setHeartColour(prev => [...prev, dt]));
    }
    catch (error) {
        console.log(error);
    }
}

export const ChangeHeartColour = ( {setHeartColour, songs} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        token && songs.length > 0 && setColour(token, setHeartColour, songs);
    }, [songs])
}