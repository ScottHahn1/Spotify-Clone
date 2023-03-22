import { useEffect, useContext, useState } from 'react';
import '../styles/RecentlyPlayed.css';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const getData = async (token, setPlaylists) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/browse/categories/toplists/playlists`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        data.playlists.items.map(playlist => setPlaylists(prev => 
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

export const GetPopular = ( {setPlaylistsFiltered} ) => {
    const {token} = useContext(TokenContext);
    const [playlists, setPlaylists] = useState([]);
    
    useEffect(() => {
        getData(token, setPlaylists);
    }, [])

    useEffect(() => {
        if (playlists.length > 0) {
            const filtered = playlists.filter(playlist => 
                playlist.title === "Today's Top Hits" || 
                playlist.title === 'RapCaviar' ||
                playlist.title === 'Top 50 - Global' || 
                playlist.title === 'Viral 50 - Global' ||
                playlist.title === 'Viral 50 - South Africa'
            );
            setPlaylistsFiltered(filtered);
        }
    }, [playlists])
}