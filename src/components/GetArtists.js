import { useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import axios from 'axios';

const getArtists = async (token, setArtists) => {
    const {data} = await axios.get('https://api.spotify.com/v1/me/following', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            type: 'artist'
        }
    });    

    data.artists.items.map(item => setArtists(prev => [
        ...prev, {
            image: item.images[2].url,
            name: item.name,
            type: item.type,
            id : item.id,
            followers: item.followers.total
        }
    ]))
}


export const GetArtists = ( {setArtists} ) => {
    const {token} = useContext(TokenContext);

    useEffect(() => {
        getArtists(token, setArtists);
    }, [token])
}