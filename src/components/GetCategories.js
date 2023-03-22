import { useEffect, useContext } from 'react';
import '../styles/RecentlyPlayed.css';
import axios from 'axios';
import { TokenContext } from '../Contexts/TokenContext';

const getCategoryData = async (token, setCategories) => {
    try {
        const {data} = await axios.get(`https://api.spotify.com/v1/browse/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        data.categories.items.map(category => setCategories(prev => 
            [
                ...prev, {
                    name: category.name,
                    id: category.id,
                    image: category.icons[0].url
                }
            ]
        ))
    }
    catch (error) {
        console.log(error);
    }
}

export const GetCategories = ( {setCategories} ) => {
    const {token} = useContext(TokenContext);
    
    useEffect(() => {
        getCategoryData(token, setCategories);
    }, [])
}