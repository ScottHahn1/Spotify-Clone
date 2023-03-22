import { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import '../styles/Search.css';
import { SearchData } from './SearchData';
import { ChangeHeartColour } from '../components/ChangeHeartColour';
import { SearchedSongs } from '../components/SearchedSongs';
import { SearchedAlbums } from '../components/SearchedAlbums';
import { SearchedArtists } from '../components/SearchedArtists';

export const Search = ( {selectedAlbum, selectedArtist, setQueuedSongs, setCurrentSong, setPaused, setPlay} ) => {
    const {token, setToken} = useContext(TokenContext);
    const [data, setData] = useState([]);
    const [searchQuery, setQuery] = useState('');
    const [getData, setGetData] = useState(false);
    const [showData, setShowData] = useState(false);
    const [heartColour, setHeartColour] = useState([]);

    const showSearchResults = e => {
        e.preventDefault();
        setGetData(true);
    }
    
    useEffect(() => {
        getData === true && setShowData(true);
    }, [data])

    return (
        <div className='search-container'>

            <form onSubmit={showSearchResults}>
                <input type='search' className='search-bar' value={searchQuery} onChange={e => setQuery(e.target.value)} />
                <button type='submit' id='search-btn'></button>
            </form>

            { getData && <SearchData token={token} searchQuery={searchQuery} setData={setData} /> }
            { data.songs && <ChangeHeartColour setHeartColour={setHeartColour} songs={data.songs} /> }

            {showData && <section className='searched-songs-container'>
                { data.songs && <SearchedSongs data={data} setQueuedSongs={setQueuedSongs} setPaused={setPaused} setPlay={setPlay} setCurrentSong={setCurrentSong} /> }
                &nbsp;
                { data.albums && <SearchedAlbums data={data} selectedAlbum={selectedAlbum} /> }
                &nbsp;
                { data.artists && <SearchedArtists data={data} selectedArtist={selectedArtist} /> }
            </section>}
        </div>
    )
}