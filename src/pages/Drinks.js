import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecipesContext from '../context/RecipesContext';
import Recipes from '../components/Recipes';

export default function Drinks({ history }) {
  const { drinks, setDrinks, drinksCategories } = useContext(RecipesContext);
  return (
    <div>
      <Header
        pageTitle="Drinks"
        searchBtn
        url="https://www.thecocktaildb.com/api/json/v1/1/"
        history={ history }
        setFunc={ setDrinks }
      />
      <Recipes
        recipes={ drinks }
        arrayKey="drinks"
        imgKey="strDrinkThumb"
        nameKey="strDrink"
        idKey="idDrink"
        categories={ drinksCategories }
      />
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

Drinks.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
