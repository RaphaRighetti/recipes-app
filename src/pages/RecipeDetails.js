import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import { getFromLocal, saveOnStorage } from '../services/storage';
import RecipesContext from '../context/RecipesContext';
import Recommendation from '../components/Recommendation';
import style from './styles/RecipesDetails.module.css';
import whiteHeart from '../images/whiteHeartIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import DetailsContext from '../context/DetailsContext';
import shareIcon from '../images/shareIcon.svg';

function RecipeDetails({ match, history, location }) {
  const { recipes, drinks, favChecked,
    setFavChecked } = useContext(RecipesContext);
  const [showCopy, setShowCopy] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const {
    ingredientes,
    pound,
    detailsRecipes,
    FetchUrl,
  } = useContext(DetailsContext);

  console.log(detailsRecipes);
  const type = match.path.split('/')[1];
  const {
    params: { id },
  } = match;

  const handleStartButton = () => {
    const localDone = typeof getFromLocal('doneRecipes') === 'string'
      ? [] : getFromLocal('doneRecipes');
    const newType = type === 'meals' ? 'meal' : 'drink';
    const recipeIsDone = localDone.some((e) => e.id === id && e.type === newType);
    setIsDone(recipeIsDone);

    const localStarted = typeof getFromLocal('inProgressRecipes') === 'string'
      ? { meals: {}, drinks: {} } : getFromLocal('inProgressRecipes');
    const recipeIsStarted = !!localStarted[type][id];
    setIsStarted(recipeIsStarted);
  };

  useEffect(() => {
    const favorites = typeof getFromLocal('favoriteRecipes') === 'string'
      ? [] : getFromLocal('favoriteRecipes');
    const isFav = favorites
      .some((recipe) => recipe.id === id);
    if (isFav) {
      setFavChecked(true);
    } else {
      setFavChecked(false);
    }
    const url = type === 'meals'
      ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    FetchUrl(url, type);
    handleStartButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
    // console.log(local);
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

  return (
    <div>

      {/* <button
        type="button"
        data-testid="favorite-btn"
        onClick={ () => saveFavorites(detailsRecipes[type][0]) }
        src={ favChecked ? blackHeart : whiteHeart }
        >
        <img
        src={ favChecked ? blackHeart : whiteHeart }
        alt="heart"
        className="heart-icon"
        />
      </button> */}
      {
        detailsRecipes[type]?.map((recipe) => (
          <div
            className={ style.container }
            key={ recipe.idMeal || recipe.idDrink }
          >
            { showCopy && <p>Link copied!</p>}

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
                    type="checkbox"
                    id="favorite-btn"
                    checked={ favChecked }
                    onChange={ () => saveFavorites(detailsRecipes[type][0]) }
                  />
                </label>
                <button
                  className={ style.share }
                  data-testid="share-btn"
                  type="button"
                  style={ { marginLeft: '200px' } }
                  onClick={ () => {
                    copy(`http://localhost:3000${location.pathname}`);
                    setShowCopy(true);
                  } }
                >
                  <img src={ shareIcon } alt="share icon" />
                </button>
              </div>
              <img
                className={ style.img_recipe }
                src={ recipe.strMealThumb || recipe.strDrinkThumb }
                alt="recipe"
                data-testid="recipe-photo"
              />
              <p
                className={ style.category }
                data-testid="recipe-category"
              >
                {recipe.strCategory}
              </p>
            </div>
            <div>
              <h3>Ingredients</h3>
              <ul>
                {
                  ingredientes.map((ing, index) => (
                    <li
                      key={ index }
                      data-testid={ `${index}-ingredient-name-and-measure` }
                    >
                      {ing}
                      {pound[index]}
                    </li>
                  ))
                }
              </ul>
            </div>
            <h3>Instructions</h3>
            <p
              className={ style.instruction }
              data-testid="instructions"
            >
              {recipe.strInstructions}
            </p>
            { type === 'meals' && (
              <div>
                <h3>Video</h3>
                <iframe
                  data-testid="video"
                  src={ recipe.strYoutube.replace('watch?v=', 'embed/')
                    .replace('youtube, youtube-nocookie') }
                  title="video youtube"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            )}
            { type === 'drinks' && (
              <p data-testid="recipe-category">{recipe.strAlcoholic}</p>
            )}
          </div>
        ))
      }
      <h3
        className={ style.recommended }
      >
        Recommended

      </h3>
      <Recommendation
        recipes={ type === 'meals' ? drinks : recipes }
        type={ type === 'meals' ? 'drinks' : 'meals' }
      />
      {isDone || (
        <button
          className={ style.start_recipes }
          data-testid="start-recipe-btn"
          type="button"
          style={ { position: 'fixed', bottom: '0' } }
          onClick={ () => history.push(`/${type}/${id}/in-progress`) }
        >
          {isStarted ? 'Continue Recipe' : 'Start Recipe'}
        </button>
      )}

    </div>
  );
}

RecipeDetails.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({ id: PropTypes.string }),
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};

export default RecipeDetails;
