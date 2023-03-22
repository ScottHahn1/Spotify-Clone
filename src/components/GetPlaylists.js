import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const getPlaylistsData = async (token, setPlaylists) => {
    const {data} = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    
    data.items.map(item => setPlaylists(prev => 
        [
            ...prev, {
                title: item.name, 
                image: item.images.length ? item.images[0].url : null,
                id: item.id,
                description: item.description
            }
        ]
    ));
};

export const GetPlaylists = ( {playlists, setPlaylists, songs, setSongs} ) => {
    const {token} = useContext(TokenContext);

    useEffect(() => {
        getPlaylistsData(token, setPlaylists);
    }, [])
}