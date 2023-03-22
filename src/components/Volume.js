import axios from 'axios';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../Contexts/TokenContext';
import '../styles/Volume.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeLow, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

const getData = async (token, volume, deviceId) => {
    try {
        await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, 
        {
            device_id: deviceId
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    catch(error) {
        console.log(error);
    }
}

const changeVolume = (event, setVolume) => {
    setVolume(event.target.value);
}

const changeVolumeIcon = (volume) => {
    if(volume < 1) {
        return <FontAwesomeIcon className='player-volume-icon' icon={faVolumeXmark} />
    }
    else if (volume > 1 && volume < 50) {
        return <FontAwesomeIcon className='player-volume-icon' icon={faVolumeLow} />
    }
    else if (volume > 49 && volume < 101) {
        return <FontAwesomeIcon className='player-volume-icon' icon={faVolumeHigh} />
    }
}

export const Volume = ( {deviceId, volume, setVolume} ) => {
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        getData(token, volume, deviceId);
    }, [volume])

    return (
        <div className='volume-container'>
            { changeVolumeIcon(volume) }
            <input 
                type='range'
                min={0}
                max={100}
                step={5}
                className='volume-slider' 
                value={volume} 
                onChange={e => changeVolume(e, setVolume)}
            >
            </input>
        </div>
    )
}