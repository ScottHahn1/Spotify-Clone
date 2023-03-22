import { useEffect, useState } from 'react';
import axios from 'axios';

export const GetTopSongs = ( {token, setTopSongs, artistId} ) => {

    const getTopSongs = async () => {
        const {data} = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        data.tracks.map(item => setTopSongs(prev => 
            [
                ...prev, item.id
            ]
        ))
    
    };

    useEffect(() => {
        getTopSongs();
    }, [token])
}