import React from 'react';
import { useState } from 'react';
import '../styles/Albums.css';
import { GetAlbums } from '../components/GetAlbums';
import { Link } from 'react-router-dom';

export const Albums = ( {selectedAlbum} ) => {
    const [albums, setAlbums] = useState([]);

    return (
        <div style={{marginLeft: '17%'}}>
            <GetAlbums setAlbums={setAlbums} />

            <div className='followed-albums-container'>
                {
                    albums.map(album => (
                        <Link to='/albums'>
                            <div className='followed-albums' onClick={ () => selectedAlbum.current = album }>
                                <img className='followed-albums-img' src={album.image[0]} alt={album.name} />
                                <h4>{album.name}</h4>
                                <p>{album.artist.join(', ')}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}