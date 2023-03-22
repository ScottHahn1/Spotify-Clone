import { useEffect, useContext } from 'react';
import '../styles/RecentlyPlayed.css';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const getData = async (token, setFeatured) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/browse/featured-playlists`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        data.playlists.items.map(playlist => setFeatured(prev => 
            [
                ...prev, {
                    title: playlist.name,
                    description: playlist.description,
                    id: playlist.id,
                    image: playlist.images[0].url,
                    uri: playlist.uri
                }
            ]
        ))
    }
    catch (error) {
        console.log(error);
    }
}

export const GetFeatured = ( {setFeatured} ) => {
    const {token} = useContext(TokenContext);
    
    useEffect(() => {
        getData(token, setFeatured);
    }, [])
}