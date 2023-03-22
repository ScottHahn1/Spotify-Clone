import { useState, useEffect, useContext, useRef} from 'react';
import { Player } from './Player';
import { PlaySong } from './PlaySong';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const getCurrentlyPlayingSong = async (token, songLength, setGotTime) => {
    try {
        const {data} = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (data.progress_ms) {
            songLength.current = data.progress_ms;
            setGotTime(true);
        }
    }
    catch(error) {
        console.log(error);
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function convertMsToMinutesSeconds(setSongProgress, increaseTimeCallback, songLength) {
    const minutes = Math.floor(songLength.current / 60000);
    const seconds = Math.round((songLength.current % 60000) / 1000);

    setSongProgress ( 
        seconds === 60
        ? `${padTo2Digits(minutes + 1)}:00`
        : `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
    )
    increaseTimeCallback(songLength);
}

const increaseTime = (songLength) => {
    songLength.current = songLength.current + 1000;
}
  
export const Play = ( {deviceId, paused, setPaused, currentSong, setCurrentSong, queuedSongs, setQueuedSongs} ) => {
    const {token, setToken} = useContext(TokenContext);
    const [volume, setVolume] = useState(100);
    const [songProgress, setSongProgress] = useState('');
    const songLength = useRef(0);
    const [gotTime, setGotTime] = useState(false);
    const progressNumber = useRef(0);

    useEffect(() => {
        songLength.current = 0;
        !songLength.current && setTimeout(() => {
            getCurrentlyPlayingSong(token, songLength, setGotTime);
        }, 3500);
    }, [currentSong])

    useEffect(() => {
        if (paused) {
            return;
        }

        else {
            const interval = setInterval(() => {
                gotTime && convertMsToMinutesSeconds(setSongProgress, increaseTime, songLength);
                if (gotTime) {
                    progressNumber.current = progressNumber.current + 1;
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gotTime, paused])

    useEffect(() => {
        queuedSongs.length > 0 && setCurrentSong(queuedSongs[0]);
    }, [])
    
    return (
        <div>
            <PlaySong deviceId={deviceId} queuedSongs={queuedSongs} setQueuedSongs={setQueuedSongs} currentSong={currentSong} /> 

            <Player 
                currentSong={currentSong} setCurrentSong={setCurrentSong}
                deviceId={deviceId} 
                paused={paused} 
                setPaused={setPaused} 
                volume={volume}
                setVolume={setVolume}
                queuedSongs={queuedSongs} setQueuedSongs={setQueuedSongs}
                songLength={songLength}
                songProgress={songProgress}
            />  
        </div>
    )
}