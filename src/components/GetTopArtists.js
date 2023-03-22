import { useEffect } from 'react';
import axios from 'axios';

const getTopArtists = async (token, setTopArtists) => {
    const {data} = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    data.items.map(item => setTopArtists(prev => 
        [
            ...prev, {
                genres: item.genres.map(genre => genre),
                id: item.id,
                name: item.name,
                image: item.images[2].url
            }
        ]
    ))
};

export const GetTopArtists = ( {token, setTopArtists} ) => {
    useEffect(() => {
        getTopArtists(token, setTopArtists);
    }, [token])
}