import React, { useEffect, useState } from 'react';
import FiltersBtns from '../components/FiltersBtns';
import { getFromLocal } from '../services/storage';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import style from './styles/RecipeCard.module.css';

export default function FavoriteRecipes() {
  const [favRecipes, setFavRecipes] = useState([]);
  const [filterParam, setFilterParam] = useState('');
  useEffect(() => {
    const local = typeof getFromLocal('favoriteRecipes') === 'string' ? []
      : getFromLocal('favoriteRecipes');
    setFavRecipes(local);
  }, []);

  return (
    <div>
      <header>
        <Header
          pageTitle="Favorite Recipes"
          searchBtn={ false }
          url="https://www.themealdb.com/api/json/v1/1/"
          setFunc={ () => true }
        />
      </header>
      <FiltersBtns setFilterParam={ setFilterParam } />
      <div className={ style.container_recipes }>
        {favRecipes.filter((e) => e.type.includes(filterParam)).map((e, index) => (
          <RecipeCard
            key={ `${e.name}-${e.type}-${e.id}` }
            recipe={ e }
            index={ index }
            setFavRecipes={ setFavRecipes }
          />
        ))}
      </div>
    </div>
  );
}
