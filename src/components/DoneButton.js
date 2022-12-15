import React from 'react';
import PropTypes from 'prop-types';
import iconeCheck from '../images/icone-check.png';

function DoneButton({ history }) {
  const handleClick = () => {
    history.push('/done-recipes');
  };

  return (
    <div>
      <img src={ iconeCheck } alt="icone de check" />
      <button
        data-testid="profile-done-btn"
        onClick={ handleClick }
        type="button"
      >
        Done Recipes
      </button>
    </div>
  );
}

DoneButton.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default DoneButton;
