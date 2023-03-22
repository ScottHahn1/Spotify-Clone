import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const getData = (data, setAlbums) => {
    data.albums.map(album => setAlbums(prev => 
        [
            ...prev, {
                name: album.name,
                artists: album.artists.map(artist => artist.name),
                image: album.images.map(img => img.url),
                id: album.id
            }
        ]
    ))
}

export const SearchedAlbums = ( {data, selectedAlbum} ) => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        getData(data, setAlbums);
    }, [])
    return (
        <>
            <h1>Albums</h1>
            <div className='searched-albums-container'>
                {albums.map((album, index) => (
                    <Link to='/albums'>
                        <div className='searched-albums' onClick={ () => {
                            selectedAlbum.current = album
                        }}>
                            <img className='searched-albums-img' src={album.image[1]} alt={album.title} />
                            <h4>{album.name}</h4>
                            <p>{album.artists.map(artist => artist)}</p>

                        </div>
                    </Link>
                )).slice(0, 5)}
            </div>
        </>
    )
}