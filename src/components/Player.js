import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import axios from 'axios';
import '../styles/Player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep, faBackwardStep, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AddSongs } from '../components/AddSongs';
import { DeleteSongs } from '../components/DeleteSongs';
import { PauseSong } from './PauseSong';
import { ResumeSong } from './ResumeSong';
import { PreviousSong } from './PreviousSong';
import { NextSong } from './NextSong';
import { Volume } from './Volume';

const addSong = (showAddedSong, setShowAddedSong, songId, setSongId) => {
    setShowAddedSong(!showAddedSong);
    setSongId(songId);
}

const updateLikedSongs = (index, heartColour, setHeartColor) => {
    const newState = heartColour.map((item, i) => {
        if (i === index) {
            return !item
        }
        else {
            return item
        }
    });
    setHeartColor(newState);
}

const toggleLikedSong = async (token, id, setHeartColour) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            } 
        });
        setHeartColour(data);
    }
    catch (error) {
        console.log(error);
    }
}

export const Player = ( {currentSong, setCurrentSong, deviceId, paused, setPaused, songLength, volume, setVolume, songProgress, queuedSongs, setQueuedSongs} ) => {
    const {token, setToken} = useContext(TokenContext);
    const [heartColour, setHeartColour] = useState([]);
    const [songId, setSongId] = useState('');
    const [showAddedSong, setShowAddedSong] = useState(false);
    const [previousClicked, setPreviousClicked] = useState(false);
    const [nextClicked, setNextClicked] = useState(false);

    useEffect(() => {
        queuedSongs.length > 0 && setCurrentSong(queuedSongs[0]);
    }, [queuedSongs])

    useEffect(() => {
        currentSong && toggleLikedSong(token, currentSong.id, setHeartColour);
    }, [currentSong])

    useEffect(() => {
        previousClicked === true && setPreviousClicked(false);
    }, [previousClicked])

    useEffect(() => {
        nextClicked === true && setNextClicked(false);
    }, [nextClicked])

    return (
        currentSong &&
        <div className='player-container'>
            <div className='player-song-info'>
                <div className='player-song-img'>
                    <img src={currentSong.image[2]} alt={currentSong.title} />
                </div>

                <div className='player-title-artist'>
                    <p>{currentSong.title}</p>
                    <p>{currentSong.artists.join(', ')}</p>
                </div>

                <div className='player-add-remove-song'>
                    <div style={ {cursor: 'pointer'} } onClick={() => {
                            addSong(showAddedSong, setShowAddedSong, currentSong.id, setSongId);
                            updateLikedSongs(0, heartColour, setHeartColour);
                        }}>
                        <div className='player-liked-heart'>
                            { 
                                heartColour[0] === true ? 
                                <FaHeart className='song-liked-heart player' style={ {color: 'seagreen'} } /> :
                                <FaRegHeart className='song-liked-heart player' /> 
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className='player-btns-player-length'>
                <section className='player-btns'>
                    <FontAwesomeIcon onClick={ () => setPreviousClicked(!previousClicked) } className='player-btn-icons' icon={faBackwardStep} />
                    <FontAwesomeIcon onClick={ () => setPaused(!paused) } className='player-btn-icons pause-play' icon={paused ? faPlay : faPause} />
                    <FontAwesomeIcon onClick={ () => {
                            queuedSongs.length > 0 && setNextClicked(!nextClicked);
                        }
                    }   className='player-btn-icons' icon={faForwardStep} />
                </section>

                <section className='player-length'>
                    { songProgress && <p> {songProgress} </p> }
                    &nbsp;
                    <progress 
                        className='song-progress-bar' 
                        value={songLength.current} 
                        max={currentSong && currentSong.lengthMilliseconds} 
                        style={ { width: `100%` } }>
                    </progress>
                    &nbsp;
                    { currentSong.length && currentSong.length() }
                </section> 
            </div>

            <div className='player-volume'>
                <Volume deviceId={deviceId} volume={volume} setVolume={setVolume} />
            </div>

            { showAddedSong === true && <AddSongs token={token} songId={songId} />  } 
            { showAddedSong === false && songId !== '' && <DeleteSongs token={token} songId={songId} />  } 
            { paused ? <PauseSong deviceId={deviceId} /> : <ResumeSong deviceId={deviceId} /> } 
            { previousClicked && <PreviousSong deviceId={deviceId} /> }
            { nextClicked && <NextSong deviceId={deviceId} queuedSongs={queuedSongs} setQueuedSongs={setQueuedSongs} /> }
        </div>
    )
}