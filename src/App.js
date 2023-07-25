import { useState, useRef } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { LikedSongs } from "./pages/LikedSongs";
import { Library } from "./components/Library";
import { LikedContext } from "./Contexts/LikedContext";
import { TokenContext } from "./Contexts/TokenContext";
import { RecentContext } from "./Contexts/RecentContext";
import { Search } from "./pages/Search";
import { ArtistMix } from "./components/ArtistMix";
import { RecentlyPlayed } from "./pages/RecentlyPlayed";
import { OnRepeat } from "./pages/OnRepeat";
import { Play } from "./components/Play";
import { WebPlayback } from "./components/WebPlayback";
import { ArtistInfo } from "./pages/ArtistInfo";
import { AlbumSongs } from "./pages/AlbumSongs";
import { PlaylistSongs } from "./pages/PlaylistSongs";
import { Categories } from "./pages/Categories";
import { CategoryPlaylists } from "./pages/CategoryPlaylists";

function App() {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [featured, setFeatured] = useState([]);
  const clickedArtist = useRef("");
  const clickedCategory = useRef("");
  const [recentSongs, setRecentSongs] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [paused, setPaused] = useState(true);
  const [transferred, setTransferred] = useState(false);
  const [currentSong, setCurrentSong] = useState("");
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [play, setPlay] = useState(false);
  const selectedPlaylist = useRef("");
  const selectedArtist = useRef("");
  const selectedAlbum = useRef("");

  const previousPage = () => {
    window.history.back();
  };

  const nextPage = () => {
    window.history.forward();
  };

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <div className="main">
        {token ? (
          <Router>
            <Navbar />

            <div className="back-forward-banner">
              <div className="back-forward-container">
                <button onClick={previousPage} className="back-forward-btn">
                  {`<`}
                </button>
                <button onClick={nextPage} className="back-forward-btn">
                  {`>`}
                </button>
              </div>
              <div className="logout">
                <Logout setToken={setToken} />
              </div>
            </div>

            <WebPlayback
              device={deviceId}
              setDevice={setDeviceId}
              setTransferred={setTransferred}
            />

            <Routes>
              <Route exact path="/">
                <Route
                  index
                  element={
                    <RecentContext.Provider
                      value={{ recentSongs, setRecentSongs }}
                    >
                      <Home
                        topArtists={topArtists}
                        setTopArtists={setTopArtists}
                        clickedArtist={clickedArtist}
                        clickedCategory={clickedCategory}
                        featured={featured}
                        setFeatured={setFeatured}
                        selectedPlaylist={selectedPlaylist}
                      />
                    </RecentContext.Provider>
                  }
                />

                <Route
                  path="/liked-songs"
                  element={
                    <LikedContext.Provider value={{ songs, setSongs }}>
                      <LikedSongs
                        setQueuedSongs={setQueuedSongs}
                        setPaused={setPaused}
                        setPlay={setPlay}
                        setCurrentSong={setCurrentSong}
                      />
                    </LikedContext.Provider>
                  }
                />

                <Route
                  path="/library"
                  element={
                    <LikedContext.Provider value={{ songs, setSongs }}>
                      {
                        <Library
                          queuedSongs={queuedSongs}
                          setQueuedSongs={setQueuedSongs}
                          setPaused={setPaused}
                          setPlay={setPlay}
                          selectedPlaylist={selectedPlaylist}
                          selectedArtist={selectedArtist}
                          selectedAlbum={selectedAlbum}
                        />
                      }
                    </LikedContext.Provider>
                  }
                />

                <Route
                  path="/search"
                  element={
                    <Search
                      setCurrentSong={setCurrentSong}
                      setQueuedSongs={setQueuedSongs}
                      setPaused={setPaused}
                      setPlay={setPlay}
                      selectedPlaylist={selectedPlaylist}
                      selectedArtist={selectedArtist}
                      selectedAlbum={selectedAlbum}
                    />
                  }
                />

                <Route
                  path="/artist-mix"
                  element={
                    <ArtistMix
                      topArtists={topArtists}
                      token={token}
                      clickedArtist={clickedArtist}
                      setQueuedSongs={setQueuedSongs}
                      setPaused={setPaused}
                      setPlay={setPlay}
                      setCurrentSong={setCurrentSong}
                    />
                  }
                />

                <Route
                  path="/recently-played"
                  element={
                    <RecentContext.Provider
                      value={{ recentSongs, setRecentSongs }}
                    >
                      <RecentlyPlayed
                        setCurrentSong={setCurrentSong}
                        setPaused={setPaused}
                        setPlay={setPlay}
                        queuedSongs={queuedSongs}
                        setQueuedSongs={setQueuedSongs}
                      />
                    </RecentContext.Provider>
                  }
                />

                <Route
                  path="/on-repeat"
                  element={
                    <OnRepeat
                      setQueuedSongs={setQueuedSongs}
                      setPaused={setPaused}
                      setPlay={setPlay}
                      setCurrentSong={setCurrentSong}
                    />
                  }
                />

                <Route
                  path="/playlists"
                  element={
                    <PlaylistSongs
                      selectedPlaylist={selectedPlaylist}
                      setQueuedSongs={setQueuedSongs}
                      setCurrentSong={setCurrentSong}
                      setPaused={setPaused}
                      setPlay={setPlay}
                    />
                  }
                />

                <Route
                  path="/artists"
                  element={
                    <ArtistInfo
                      selectedArtist={selectedArtist}
                      setQueuedSongs={setQueuedSongs}
                      setCurrentSong={setCurrentSong}
                      setPaused={setPaused}
                      setPlay={setPlay}
                    />
                  }
                />

                <Route
                  path="/albums"
                  element={
                    <AlbumSongs
                      selectedAlbum={selectedAlbum}
                      setQueuedSongs={setQueuedSongs}
                      setCurrentSong={setCurrentSong}
                      setPaused={setPaused}
                      setPlay={setPlay}
                    />
                  }
                />

                <Route
                  path="/categories"
                  element={<Categories clickedCategory={clickedCategory} />}
                />

                <Route
                  path="/category-playlist"
                  element={
                    <CategoryPlaylists
                      clickedCategory={clickedCategory}
                      selectedPlaylist={selectedPlaylist}
                    />
                  }
                />
              </Route>
            </Routes>

            {play && (
              <Play
                deviceId={deviceId}
                paused={paused}
                setPaused={setPaused}
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                queuedSongs={queuedSongs}
                setQueuedSongs={setQueuedSongs}
              />
            )}
          </Router>
        ) : (
          <Login />
        )}
      </div>
    </TokenContext.Provider>
  );
}

export default App;
