import { useContext, useState, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import axios from 'axios';

const getData = async (token, topArtists, increment, setIncrement, setSongs) => {
    try {
        const {data} = await axios.get(
            `https://api.spotify.com/v1/recommendations?seed_artists=${topArtists[increment].id}&seed_genres=${topArtists[increment].genres.map(genre => genre)
            .slice(0, 3).join('%2C').replace(/\s+/g, '')}`, 
        {       
            headers: {
                Authorization: `Bearer ${token}`
            } 
        });

        data.tracks.map(track => setSongs(prev => 
            [
                ...prev, {
                    title: track.name,
                    artists: track.artists.map(artist => artist.name),
                    image: track.album.images.map(img => img.url),
                    id: increment
                }
            ]
        ))
        setIncrement(increment + 1);
    }
    catch(error) {
        console.log(error.response);
    }
}

export const GetRecommended = ( {recommended, setRecommended, topArtists} ) => {
    const {token} = useContext(TokenContext);
    const [increment, setIncrement] = useState(0);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        topArtists.length > 0 && increment < 5 && getData(token, topArtists, increment, setIncrement, setSongs);
    }, [topArtists, increment])

    useEffect(() => {
        songs.length > 99 && 
        setRecommended(songs.reduce(function (r, a) {
            r[a.id] = r[a.id] || [];
            r[a.id].push(a);
            return r;
        }, Object.create(null)));
    }, [increment])
}