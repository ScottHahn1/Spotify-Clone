import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';

export const SearchData = ( {token, searchQuery, setData} ) => {

    const getSearchedData = async () => {
        const {data} = await axios.get('https://api.spotify.com/v1/search?type=album,artist,track', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchQuery
            }
        });
        setData(
            {
                albums: data.albums.items, 
                artists: data.artists.items, 
                songs: data.tracks.items
            }
        );
    }

    useEffect(() => {
        getSearchedData();
    }, [searchQuery])
}