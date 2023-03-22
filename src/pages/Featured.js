import { useState, useEffect, useContext } from 'react';
import '../styles/RecentlyPlayed.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../Contexts/TokenContext';

const getCategoryPlaylist = async (token, category, setPlaylists) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/browse/categories/${category.current.id}/playlists`, {
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

export const Featured = ( {clickedCategory, clickedPlaylist, selectedPlaylist} ) => {
    const {token} = useContext(TokenContext);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        getCategoryPlaylist(token, clickedCategory, setPlaylists);
    }, [])

    return (
        <div className='catgegory-playlists-container'>
            <div className='category-playlists'>
                {
                    playlists.map((playlist, index) => 
                        <Link to='/'>
                            <div className='category-playlist' onClick={ () => selectedPlaylist.current = playlist }>
                                <img className='category-img' src={playlist.image} alt={playlist.title} />
                                <p>{playlist.title}</p>
                            </div>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}