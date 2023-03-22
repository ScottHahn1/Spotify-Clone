import { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import axios from 'axios';

export const GetAlbums = ( {setAlbums} ) => {
    const {token} = useContext(TokenContext);
    const [link, setLink] = useState('https://api.spotify.com/v1/me/albums');

    const getAlbums = async () => {
        const {data} = await axios.get(link, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });    
        
        data.items.map(item => setAlbums(prev => [
            ...prev, {
                name: item.album.name,
                artist: item.album.artists.map(x => x.name),
                image: item.album.images.map(img => img.url),
                id: item.album.id,
                releaseDate: item.album.release_date,
                songTotal: item.album.total_tracks
            }
        ]));
    }

    useEffect(() => {
        getAlbums();
    }, [token])
}