import React from 'react';
import PropTypes from 'prop-types';
import style from '../pages/styles/FilterBtns.module.css';
import allIcon from '../images/All.png';
import mealIcon from '../images/icone-prato.png';
import drinkIcon from '../images/icone-bebida.png';

export default function FiltersBtns({ setFilterParam }) {
  return (
    <div className={ style.container }>
      <button
        className={ style.button }
        type="button"
        data-testid="filter-by-all-btn"
        onClick={ () => setFilterParam('') }
      >
        <img src={ allIcon } alt="All" />
      </button>
      <button
        className={ style.button }
        type="button"
        data-testid="filter-by-meal-btn"
        onClick={ () => setFilterParam('meal') }
      >
        <img src={ mealIcon } alt="Meals" />
      </button>
      <button
        className={ style.button }
        type="button"
        data-testid="filter-by-drink-btn"
        onClick={ () => setFilterParam('drink') }
      >
        <img src={ drinkIcon } alt="Drinks" />
      </button>
    </div>
  );
}

FiltersBtns.propTypes = {
  setFilterParam: PropTypes.func.isRequired,
};
