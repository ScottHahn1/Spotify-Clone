import React from 'react';
import { Link } from 'react-router-dom';

export const SearchedArtists = ( {data, selectedArtist} ) => {
    return (
        <>
            <h1>Artists</h1>
            <div className='searched-artists-container'>
                { 
                    data.artists.map((artist, index) => (
                        <Link to='/artists'>
                            <div className='searched-artists' onClick={selectedArtist.current = artist}>
                                { artist.images.length && <img className='searched-artists-img' src={artist.images[0].url} alt={artist.name} /> }
                                <h3>{artist.name}</h3>
                                <p>Artist</p>
                            </div>
                        </Link>
                    )).slice(0, 5) 
                }
            </div>
        </>
    )
}