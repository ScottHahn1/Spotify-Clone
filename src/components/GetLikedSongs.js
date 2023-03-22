import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { LikedContext } from '../Contexts/LikedContext';

export const GetLikedSongs = ( {token} ) => {
    const [link, setLink] = useState('https://api.spotify.com/v1/me/tracks?limit=50');
    const {setSongs} = useContext(LikedContext);

    const getLikedSongs = async () => {
        const {data} = await axios.get(link, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        data.items.map(item => setSongs(prev => 
            [
                ...prev, {
                    title: item.track.name, 
                    artists: item.track.artists.map(artist => artist.name), 
                    album: item.track.album.name,
                    dateAdded: new Date(item.added_at).toDateString(),
                    image: item.track.album.images[2].url,
                    uri: item.track.uri,
                    id: item.track.id,
                    lengthMilliseconds : item.track.duration_ms,
                    length: function() {
                        const milliseconds = item.track.duration_ms / 1000;
                        const toMinsSecs = `${Math.floor(milliseconds / 60) % 60}:${Math.floor(milliseconds) % 60}`;
                        return toMinsSecs.split(':')[1].length > 1 ? toMinsSecs : toMinsSecs.slice(0, toMinsSecs.indexOf(':')) + ':0' + toMinsSecs.slice(-1);
                    }
                }
            ]
        ));
        data.next !== null && setLink(data.next);
    }

    useEffect(() => {
        getLikedSongs();
    }, [token, link])
}