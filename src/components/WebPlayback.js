import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../Contexts/TokenContext';

const sdk = (token, setDevice, player, setPlayer) => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { 
                cb(token); 
            },
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
            setDevice(device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
        });

        player.connect();
    };
}

const transferPlayBack = async (token, device, setTransferred) => {
    try {
        await axios.put('https://api.spotify.com/v1/me/player/play', 
        {
            device_ids: [
                device
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }
    catch(error) {
        console.log(error);
    }
    setTransferred(true);
}

export const WebPlayback = ( {device, setDevice, setTransferred} ) => {
    const {token, setToken} = useContext(TokenContext);
    const [player, setPlayer] = useState(undefined);

    useEffect(() => {
        sdk(token, setDevice, player, setPlayer);
    }, [])

    useEffect(() => {
        device && transferPlayBack(token, device, setTransferred);
    }, [device])
}