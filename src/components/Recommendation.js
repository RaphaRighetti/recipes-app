import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

export default function Recommendation({ recipes, type }) {
  const maxItems = 6;
  const history = useHistory();
  const handleClick = (idRecipe) => {
    history.push(`/${type}/${idRecipe}`);
    // window.scrollTo(0, 0);
  };
  return (
    <div className="container-recommend">
      {recipes[type]?.filter((_e, i) => i < maxItems).map((recipe, index) => (
        <div
          key={ recipe.idMeal || recipe.idDrink }
          className="box-recommend"
          data-testid={ `${index}-recommendation-card` }
          onClick={ () => handleClick(recipe.idMeal || recipe.idDrink) }
          aria-hidden="true"
        >
          <p data-testid={ `${index}-recommendation-title` }>
            {recipe.strMeal || recipe.strDrink}
          </p>
          <img src={ recipe.strMealThumb || recipe.strDrinkThumb } alt="recipe" />
        </div>
      ))}
    </div>
  );
}

Recommendation.propTypes = {
  recipes: PropTypes
    .objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))).isRequired,
  type: PropTypes.string.isRequired,
};
