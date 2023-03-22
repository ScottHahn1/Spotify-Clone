import { useState } from 'react';
import '../styles/RecentlyPlayed.css';
import { Link } from 'react-router-dom';
import { GetCategories } from '../components/GetCategories';
import '../styles/Categories.css';

const changeClickedCategory = (clickedCategory, name, index, image, id) => {
    clickedCategory.current = { name, index, image, id }
}

export const Categories = ( {clickedCategory} ) => {
    const [categories, setCategories] = useState([]);

    return (
        <div className='categories-container'>
            <GetCategories setCategories={setCategories} />

            <div className='categories'>
                {
                    categories.map((category, index) => 
                        <Link to='/category-playlist'>
                            <div className='category-playlist' onClick={ () => changeClickedCategory(clickedCategory, category.name, index, category.image, category.id) }>
                                <img className='category-img' src={category.image} alt={category.name} />
                                <p>{category.name}</p>
                            </div>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}