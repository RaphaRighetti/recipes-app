import React from 'react';
import PropTypes from 'prop-types';
import iconeCoracao from '../images/Icone-coracao.png';

function FavoriteButton({ history }) {
  const handleClick = () => {
    history.push('/favorite-recipes');
  };

  return (
    <div>
      <img
        src={ iconeCoracao }
        alt="icone de coração"
      />
      <button
        data-testid="profile-favorite-btn"
        onClick={ handleClick }
        type="button"
      >
        Favorite Recipes
      </button>
    </div>
  );
}

FavoriteButton.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default FavoriteButton;
