import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecipesContext from '../context/RecipesContext';
import Recipes from '../components/Recipes';

export default function Meals({ history }) {
  const { recipes, setRecipes, mealsCategories } = useContext(RecipesContext);
  return (
    <div>
      <Header
        pageTitle="Meals"
        searchBtn
        url="https://www.themealdb.com/api/json/v1/1/"
        history={ history }
        setFunc={ setRecipes }
      />
      <Recipes
        recipes={ recipes }
        arrayKey="meals"
        imgKey="strMealThumb"
        nameKey="strMeal"
        idKey="idMeal"
        categories={ mealsCategories }
      />
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

Meals.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
