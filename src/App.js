import { useState, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { LikedSongs } from './pages/LikedSongs';
import { Library } from './components/Library';
import { LikedContext } from './Contexts/LikedContext';
import { TokenContext } from './Contexts/TokenContext';
import { RecentContext } from './Contexts/RecentContext';
import { Search } from './pages/Search';
import { ArtistMix } from './components/ArtistMix';
import { RecentlyPlayed } from './pages/RecentlyPlayed';
import { OnRepeat } from './pages/OnRepeat';
import { Play } from './components/Play';
import { WebPlayback } from './components/WebPlayback';
import { ArtistInfo } from './pages/ArtistInfo';
import { AlbumSongs } from './pages/AlbumSongs';
import { PlaylistSongs } from './pages/PlaylistSongs';
import { Categories } from './pages/Categories';
import { CategoryPlaylists } from './pages/CategoryPlaylists';

function App() {
    const [token, setToken] = useState('');
    const [songs, setSongs] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [featured, setFeatured] = useState([]);
    const clickedArtist = useRef('');
    const clickedCategory = useRef('');
    const [recentSongs, setRecentSongs] = useState([]);
    const [deviceId, setDeviceId] = useState('');
    const [paused, setPaused] = useState(true);
    const [transferred, setTransferred] = useState(false);
    const [currentSong, setCurrentSong] = useState('');
    const [queuedSongs, setQueuedSongs] = useState([]);
    const [play, setPlay] = useState(false);
    const selectedPlaylist = useRef('');
    const selectedArtist = useRef('');
    const selectedAlbum = useRef('');

    return (
        <div className='main'>
            { token ?
                <Router>
                    <Navbar />

                    <TokenContext.Provider value={ {token, setToken} }>
                        <WebPlayback device={deviceId} setDevice={setDeviceId} setTransferred={setTransferred} />
                    </TokenContext.Provider>

                    <Routes>
                        <Route exact path='/'>
                            <Route index element={ 
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <RecentContext.Provider value={ {recentSongs, setRecentSongs} }>
                                        <Home 
                                            topArtists={topArtists} setTopArtists={setTopArtists} 
                                            clickedArtist={clickedArtist} 
                                            clickedCategory={clickedCategory}
                                            featured={featured} setFeatured={setFeatured} 
                                            selectedPlaylist={selectedPlaylist} 
                                        />
                                    </RecentContext.Provider>
                                </TokenContext.Provider>
                            } />

                            <Route path='/liked-songs' element= {
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <LikedContext.Provider value={ {songs, setSongs} }> 
                                        <LikedSongs 
                                                setQueuedSongs={setQueuedSongs} 
                                                setPaused={setPaused} 
                                                setPlay={setPlay} 
                                                setCurrentSong={setCurrentSong} 
                                        /> 
                                    </LikedContext.Provider> 
                                </TokenContext.Provider>
                            } />
                            
                            <Route path='/library' element= {
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <LikedContext.Provider value={ {songs, setSongs} }>
                                        {
                                            <Library 
                                                queuedSongs={queuedSongs} setQueuedSongs={setQueuedSongs} 
                                                setPaused={setPaused} 
                                                setPlay={setPlay} 
                                                selectedPlaylist={selectedPlaylist}
                                                selectedArtist={selectedArtist}
                                                selectedAlbum={selectedAlbum}
                                            />
                                        }
                                    </LikedContext.Provider>
                                </TokenContext.Provider>
                            } />

                            <Route path='/search' element={ 
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <Search 
                                        setCurrentSong={setCurrentSong}
                                        setQueuedSongs={setQueuedSongs}
                                        setPaused={setPaused} 
                                        setPlay={setPlay} 
                                        selectedPlaylist={selectedPlaylist}
                                        selectedArtist={selectedArtist}
                                        selectedAlbum={selectedAlbum}
                                    />
                                </TokenContext.Provider>
                            } />

                            <Route path='/artist-mix' element={ 
                                <ArtistMix 
                                    topArtists={topArtists} 
                                    token={token} 
                                    clickedArtist={clickedArtist} 
                                    setQueuedSongs={setQueuedSongs} 
                                    setPaused={setPaused} 
                                    setPlay={setPlay} 
                                    setCurrentSong={setCurrentSong} 
                                />   
                            } />

                            <Route path='/recently-played' element={ 
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <RecentContext.Provider value={ {recentSongs, setRecentSongs} }>
                                        <RecentlyPlayed setCurrentSong={setCurrentSong} setPaused={setPaused} setPlay={setPlay} queuedSongs={queuedSongs} setQueuedSongs={setQueuedSongs} /> 
                                    </RecentContext.Provider>
                                </TokenContext.Provider>
                            } />

                            <Route path='/on-repeat' element={ 
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <OnRepeat setQueuedSongs={setQueuedSongs} setPaused={setPaused} setPlay={setPlay} setCurrentSong={setCurrentSong} /> 
                                </TokenContext.Provider>
                            } />

                            <Route path='/playlists' element={
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <PlaylistSongs 
                                        selectedPlaylist={selectedPlaylist} 
                                        setQueuedSongs={setQueuedSongs} 
                                        setCurrentSong={setCurrentSong} 
                                        setPaused={setPaused} 
                                        setPlay={setPlay} 
                                    />
                                </TokenContext.Provider>
                            } />

                            <Route path='/artists' element={
                                transferred && 
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <ArtistInfo 
                                        selectedArtist={selectedArtist} 
                                        setQueuedSongs={setQueuedSongs} 
                                        setCurrentSong={setCurrentSong} 
                                        setPaused={setPaused} 
                                        setPlay={setPlay} 
                                    />
                                </TokenContext.Provider>
                            } />

                            <Route path='/albums' element={
                                transferred && 
                                <TokenContext.Provider value={ {token, setToken} }>
                                    <AlbumSongs 
                                        selectedAlbum={selectedAlbum} 
                                        setQueuedSongs={setQueuedSongs} 
                                        setCurrentSong={setCurrentSong} 
                                        setPaused={setPaused} 
                                        setPlay={setPlay}
                                     />
                                </TokenContext.Provider>
                            } />

                            <Route path='/categories' element={
                                <TokenContext.Provider value={ {token} }>
                                    <Categories clickedCategory={clickedCategory} />
                                </TokenContext.Provider>
                            } />

                            <Route path='/category-playlist' element={
                                <TokenContext.Provider value={ {token} }>
                                    <CategoryPlaylists clickedCategory={clickedCategory} selectedPlaylist={selectedPlaylist} />
                                </TokenContext.Provider>
                            } />

                        </Route>
                    </Routes>

                    <TokenContext.Provider value={ {token, setToken} }>
                        { play && 
                        <Play 
                            deviceId={deviceId} 
                            paused={paused} setPaused={setPaused} 
                            currentSong={currentSong} setCurrentSong={setCurrentSong}
                            queuedSongs={queuedSongs} setQueuedSongs={setQueuedSongs}
                        /> }
                    </TokenContext.Provider>
                </Router>
                :
                <TokenContext.Provider value={ {token, setToken} }>
                    <Login />
                </TokenContext.Provider>
            }
        </div>
    )
}

export default App;