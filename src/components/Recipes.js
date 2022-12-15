import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import style from '../pages/styles/Recipes.module.css';
import RecipesContext from '../context/RecipesContext';

export default function Recipes({ recipes, arrayKey, imgKey,
  nameKey, idKey, categories }) {
  const maxRecipes = 12;
  const { setDrinks, setRecipes, fetchRecipes,
    fetchDrinks, selectedCategory, setSelectedCategory } = useContext(RecipesContext);
  const history = useHistory();

  const fetchAll = () => {
    if (selectedCategory === 'All') {
      return true;
    }
    setSelectedCategory('All');
    if (arrayKey === 'meals') {
      return fetchRecipes();
    }
    if (arrayKey === 'drinks') {
      return fetchDrinks();
    }
  };

  const fetchCategories = async (categoryName) => {
    const url = arrayKey === 'meals' ? 'https://www.themealdb.com/api/json/v1/1/filter.php?c='
      : 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';
    const response = await fetch(`${url}${categoryName}`);
    const data = await response.json();
    data[arrayKey] = data[arrayKey].filter((_e, i) => i < maxRecipes);
    if (selectedCategory === categoryName) return fetchAll();
    setSelectedCategory(categoryName);
    if (arrayKey === 'meals') {
      setRecipes(data);
    }
    if (arrayKey === 'drinks') {
      setDrinks(data);
    }
  };

  const handleClick = (id) => {
    history.push(`/${arrayKey}/${id}`);
  };

  return (
    <div>
      <div className={ style.container__btn }>
        <button
          className={ style.btn__filter }
          type="button"
          onClick={ fetchAll }
          data-testid="All-category-filter"
        >
          All
        </button>
        {categories[arrayKey]?.length > 0
        && categories[arrayKey]?.map((e, i) => (
          <button
            className={ style.btn__filter }
            key={ `${e.strCategory}-${i}` }
            type="button"
            data-testid={ `${e.strCategory}-category-filter` }
            onClick={ () => fetchCategories(e.strCategory) }
          >
            {e.strCategory}
          </button>
        ))}
      </div>
      <div className={ style.container_recipes }>
        {recipes[arrayKey]?.length > 0
      && recipes[arrayKey].filter((_e, i) => i < maxRecipes)
        .map((element, index) => (
          <div
            className={ style.card }
            key={ `${element[idKey]}-${index}` }
            data-testid={ `${index}-recipe-card` }
            onClick={ () => handleClick(element[idKey]) }
            aria-hidden="true"
          >
            <img
              className={ style.recipe }
              src={ element[imgKey] }
              alt={ element[nameKey] }
              data-testid={ `${index}-card-img` }
            />
            <p data-testid={ `${index}-card-name` }>
              { element[nameKey] }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

Recipes.propTypes = {
  recipes: PropTypes
    .objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))).isRequired,
  arrayKey: PropTypes.string.isRequired,
  imgKey: PropTypes.string.isRequired,
  nameKey: PropTypes.string.isRequired,
  idKey: PropTypes.string.isRequired,
  categories: PropTypes.objectOf(PropTypes.arrayOf(PropTypes
    .shape({ strCategory: PropTypes.string }))).isRequired,
};
