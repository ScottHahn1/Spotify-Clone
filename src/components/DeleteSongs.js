import { useEffect, useState } from 'react';
import axios from 'axios';

const deleteData = async (token, songId) => {
    const {data} = await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${songId}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
     }
    });
}

export const DeleteSongs = ( {token, songId} ) => {
    useEffect(() => {
        deleteData(token, songId);
    }, [songId])
}