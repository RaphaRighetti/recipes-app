import React, { useContext, useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import copy from 'clipboard-copy';
import PropTypes from 'prop-types';
import DetailsContext from '../context/DetailsContext';
import '../App.css';
import { saveOnStorage, getFromLocal } from '../services/storage';
import whiteHeart from '../images/whiteHeartIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import RecipesContext from '../context/RecipesContext';
import style from './styles/RecipesInProgress.module.css';
import shareIcon from '../images/shareIcon.svg';

function RecipeInProgress({ history }) {
  const { detailsRecipes, checked,
    ingredientes, pound, setChecked,
    FetchUrl } = useContext(DetailsContext);
  const { favChecked,
    setFavChecked } = useContext(RecipesContext);
  const [showCopy, setShowCopy] = useState(false);
  const match = useRouteMatch();

  const type = match.path.split('/')[1];
  const { params: { id } } = match;
  useEffect(() => {
    const favorites = typeof getFromLocal('favoriteRecipes') === 'string'
      ? [] : getFromLocal('favoriteRecipes');
    const isFav = favorites.some((recipe) => recipe.id === id);
    setFavChecked(isFav);

    const url = type === 'meals'
      ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    FetchUrl(url, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChecked = (index) => {
    const salveChecked = {
      ...checked,
      [`checked${index}`]:
      !checked[`checked${index}`],
    };
    setChecked(salveChecked);
    const local = typeof getFromLocal('inProgressRecipes')
    === 'string' ? { meals: {}, drinks: {} } : getFromLocal('inProgressRecipes');
    const newLocal = {
      meals: { ...local.meals },
      drinks: { ...local.drinks },
      [type]: {
        ...local[type],
        [id]: [salveChecked],
      },
    };
    saveOnStorage('inProgressRecipes', newLocal);
  };

  const saveFavorites = (recipe) => {
    const newType = type === 'meals' ? 'meal' : 'drink';
    const obj = {
      id: recipe.idMeal || recipe.idDrink,
      type: newType,
      nationality: recipe.strArea || '',
      category: recipe.strCategory,
      alcoholicOrNot: recipe.strAlcoholic || '',
      name: recipe.strMeal || recipe.strDrink,
      image: recipe.strMealThumb || recipe.strDrinkThumb,
    };
    const local = typeof getFromLocal('favoriteRecipes') === 'string'
      ? [] : getFromLocal('favoriteRecipes');
    const isFav = local.some((e) => e.id === id && e.type === newType);
    if (isFav) {
      const newLocal = local.filter((e) => e.id !== id || e.type !== newType);
      saveOnStorage('favoriteRecipes', newLocal);
      setFavChecked(false);
    } else {
      const newLocal = [...local, obj];
      saveOnStorage('favoriteRecipes', newLocal);
      setFavChecked(true);
    }
  };

  const handleFinish = () => {
    const local = typeof getFromLocal('doneRecipes') === 'string' ? []
      : getFromLocal('doneRecipes');
    const newType = type === 'meals' ? 'meal' : 'drink';
    const recipe = detailsRecipes[type][0];
    const doneDate = new Date().toISOString();

    const obj = {
      id,
      nationality: recipe.strArea || '',
      name: recipe.strMeal || recipe.strDrink,
      category: recipe.strCategory,
      image: recipe.strMealThumb || recipe.strDrinkThumb,
      tags: recipe.strTags?.split(',') || [],
      alcoholicOrNot: recipe.strAlcoholic || '',
      type: newType,
      doneDate,
    };

    const newLocal = local.filter((e) => e.id !== id || e.type !== newType);
    saveOnStorage('doneRecipes', [...newLocal, obj]);
    history.push('/done-recipes');
  };

  return (
    <div>
      {detailsRecipes[type].map((recipe) => (
        <div
          className={ style.container }
          key={ recipe.idMeal || recipe.idDrink }
        >
          <div>
            <div className={ style.container_title }>
              <h1 data-testid="recipe-title">
                {recipe.strMeal || recipe.strDrink}
              </h1>
              <label
                className={ style.label_coracao }
                htmlFor="favorite-btn"
              >
                <img
                  className={ style.coracao }
                  src={ favChecked ? blackHeart : whiteHeart }
                  alt="heart"
                  data-testid="favorite-btn"
                />
                <input
                  className={ style.input__coracao }
                  type="checkbox"
                  id="favorite-btn"
                  checked={ favChecked }
                  onChange={ () => saveFavorites(detailsRecipes[type][0]) }
                />

                <img
                  className={ style.share }
                  style={ { marginLeft: '200px' } }
                  src={ shareIcon }
                  alt="share icon"
                  onClick={ () => {
                    copy(`http://localhost:3000/${type}/${id}`);
                    setShowCopy(true);
                  } }
                  aria-hidden="true"
                />
                { showCopy && <p>Link copied!</p>}

              </label>
            </div>
            <img
              className={ style.img_recipe }
              src={ recipe.strMealThumb || recipe.strDrinkThumb }
              alt=""
              data-testid="recipe-photo"
            />
            <p
              className={ style.category }
              data-testid="recipe-category"
            >
              {recipe.strCategory}

            </p>
          </div>

          <ol>
            {
              ingredientes.map((ing, index) => (
                <li
                  key={ index }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                  name={ ing }
                  className={ checked[`checked${index}`]
                    ? 'recipeChecked' : 'recipeNoChecked' }
                >
                  <label
                    htmlFor={ `ingredientes-checked-${index}` }
                    data-testid={ `${index}-ingredient-step` }
                    className={ checked[`checked${index}`]
                      ? 'recipeChecked' : 'recipeNoChecked' }
                  >
                    <input
                      key={ index }
                      type="checkbox"
                      name={ ing }
                      // onChange={ handleChange }
                      id={ `ingredientes-checked-${index}` }
                      onChange={ () => handleChecked(index) }
                      checked={ checked[`checked${index}`] }
                    />
                    {ing}
                    {pound[index]}
                  </label>
                </li>
              ))
            }
          </ol>
          <h3>Instructions</h3>
          <p
            className={ style.instruction }
            data-testid="instructions"
          >
            {recipe.strInstructions}

          </p>
          {type === 'meals' && (
            <iframe
              data-testid="video"
              src={ recipe.strYoutube.replace('watch?v=', 'embed/') }
              title="video youtube"
              allowFullScreen
              frameBorder="0"
            />
          )}
          {type === 'drinks' && (
            <div>
              <p
                className={ style.alcool }
                data-testid="recipe-category"
              >
                {recipe.strAlcoholic}

              </p>
            </div>
          )}
          <button
            className={ style.start_recipes }
            data-testid="finish-recipe-btn"
            type="button"
            style={ { position: 'fixed', bottom: '0' } }
            disabled={ Object.values(checked).some((e) => e === false) }
            onClick={ handleFinish }
          >
            Finish Recipe
          </button>
        </div>))}
    </div>
  );
}

RecipeInProgress.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({ id: PropTypes.string }),
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default RecipeInProgress;
