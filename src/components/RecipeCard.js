import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import { useHistory } from 'react-router-dom';
import blackHeart from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import { getFromLocal, saveOnStorage } from '../services/storage';
import style from '../pages/styles/RecipeCard.module.css';

export default function RecipeCard({ recipe, index, isDonePage, setFavRecipes }) {
  const [showCopy, setShowCopy] = useState(false);
  const [animationName, setAnimationName] = useState('');
  const history = useHistory();
  useEffect(() => {
    if (animationName === '') {
      setAnimationName(style.animationStart);
    }
  }, [animationName]);

  const deleteFavorites = () => {
    const local = typeof getFromLocal('favoriteRecipes') === 'string'
      ? [] : getFromLocal('favoriteRecipes');
    // console.log(local);
    const newLocal = local.filter((e) => e.id !== recipe.id || e.type !== recipe.type);
    saveOnStorage('favoriteRecipes', newLocal);
    setFavRecipes(newLocal);
  };
  return (
    <div className={ style.card }>
      <img
        className={ style.recipe }
        src={ recipe.image }
        alt={ recipe.name }
        style={ { maxWidth: '200px' } }
        data-testid={ `${index}-horizontal-image` }
        onClick={ () => history.push(`/${recipe.type}s/${recipe.id}`) }
        aria-hidden="true"
      />
      <p data-testid={ `${index}-horizontal-top-text` }>
        {recipe.type === 'meal' ? `${recipe.nationality} - ${recipe.category}`
          : `${recipe.alcoholicOrNot}`}
      </p>
      <p
        data-testid={ `${index}-horizontal-name` }
        onClick={ () => history.push(`/${recipe.type}s/${recipe.id}`) }
        aria-hidden="true"
        style={ { cursor: 'pointer' } }
      >
        {recipe.name}
      </p>
      {isDonePage && (
        <>
          <p
            data-testid={ `${index}-horizontal-done-date` }
            style={ { fontWeight: '600', fontSize: '11px' } }
          >
            {recipe.doneDate}
          </p>
          {recipe.tags?.map((e, i) => (
            <p
              data-testid={ `${index}-${e}-horizontal-tag` }
              key={ `${e}=${index}-${i}` }
            >
              {e}
            </p>
          ))}
        </>
      )}
      <div className={ style.buttonsContainer }>
        <div className={ style.linkContainer }>
          { showCopy && <p className={ animationName }>Link copied!</p>}
          <div
            className={ style.shareImg }
            style={ { left: isDonePage ? '17px' : 0 } }
          >
            <img
              className={ style.shareIcon }
              src={ shareIcon }
              alt="sh/7Aare icon"
              data-testid={ `${index}-horizontal-share-btn` }
              onClick={ () => {
                setAnimationName('');
                copy(`http://localhost:3000/${recipe.type}s/${recipe.id}`);
                setShowCopy(true);
              } }
              aria-hidden="true"
            />
          </div>
        </div>
        {isDonePage || (
          <div className={ style.heartBox }>
            <img
              src={ blackHeart }
              alt="heart"
              className="heart-icon"
              data-testid={ `${index}-horizontal-favorite-btn` }
              onClick={ deleteFavorites }
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}

RecipeCard.defaultProps = {
  isDonePage: false,
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    doneDate: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    nationality: PropTypes.string,
    alcoholicOrNot: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number.isRequired,
  isDonePage: PropTypes.bool,
  setFavRecipes: PropTypes.func.isRequired,
};
