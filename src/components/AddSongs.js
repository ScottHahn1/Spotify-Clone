import { useEffect, useState } from 'react';
import axios from 'axios';

const addData = async (token, songId) => {
    await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${songId}`, 
    {
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
     }
    });
}

export const AddSongs = ( {token, songId} ) => {
    useEffect(() => {
        addData(token, songId);
    }, [songId])
}