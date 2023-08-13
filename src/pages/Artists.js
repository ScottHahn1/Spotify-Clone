import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import '../styles/Artists.css';
import { GetArtists } from '../components/GetArtists';

export const Artists = ( {selectedArtist} ) => {
    const [artists, setArtists] = useState([]);

    return (
        <div style={{marginLeft: '15em'}}>
            <GetArtists setArtists={setArtists} />

            <div className='followed-artists-container'>
                {
                    artists.map(artist => (
                        <Link to='/artists'>
                            <div className='followed-artists' onClick={ () => selectedArtist.current = artist }>
                                <img className='followed-artists-img' src={artist.image} alt={artist.name} />
                                <h3>{artist.name}</h3>
                                <p>Artist</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}