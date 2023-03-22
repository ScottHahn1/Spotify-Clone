import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faHeart, faHouse, faMagnifyingGlass, faTableCells } from '@fortawesome/free-solid-svg-icons';

export const Navbar = () => {
    return (
        <nav>
            <section className='navbar'>
                <Link to='/'>
                    <div className='nav-items'>
                        <FontAwesomeIcon icon={faHouse} />
                        <h3>Home</h3>
                    </div>
                </Link>
                <Link to='/search'>
                    <div className='nav-items'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <h3>Search</h3>
                    </div>
                </Link>
                <br></br>

                <Link to='/library'>
                    <div className='nav-items'>
                        <FontAwesomeIcon icon={faFolderOpen} />
                        <h3>Your Library</h3>
                    </div>
                </Link>
                
                <Link to='/liked-songs'>
                    <div className='nav-items'>
                        <FontAwesomeIcon icon={faHeart} />
                        <h3>Liked Songs</h3>
                    </div>
                </Link>

                <Link to='/categories'>
                    <div className='nav-items'>
                        <FontAwesomeIcon icon={faTableCells} />
                        <h3>Categories</h3>
                    </div>
                </Link>
            </section>
        </nav>
    )
}