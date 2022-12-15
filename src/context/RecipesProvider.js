import { useEffect, useMemo, useState } from 'react';
import RecipesContext from './RecipesContext';

export default function RecipesProvider({ children }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [radioSearch, setRadioSearch] = useState('i');
  const [recipes, setRecipes] = useState({ meals: [] });
  const [drinks, setDrinks] = useState({ drinks: [] });
  const [mealsCategories, setMealsCategories] = useState({ meals: [] });
  const [drinksCategories, setDrinksCategories] = useState({ drinks: [] });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favChecked, setFavChecked] = useState(false);

  const fetchRecipes = async () => {
    const maxRecipes = 12;
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    data.meals = data.meals?.filter((_e, i) => i < maxRecipes);
    setRecipes(data);
  };

  const fetchDrinks = async () => {
    const maxRecipes = 12;
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    data.drinks = data.drinks?.filter((_e, i) => i < maxRecipes);
    setDrinks(data);
  };

  const value = useMemo(() => ({
    email,
    setEmail,
    password,
    setPassword,
    radioSearch,
    setRadioSearch,
    recipes,
    setRecipes,
    drinks,
    setDrinks,
    mealsCategories,
    drinksCategories,
    fetchRecipes,
    fetchDrinks,
    selectedCategory,
    setSelectedCategory,
    favChecked,
    setFavChecked,
  }), [email, password, radioSearch, recipes,
    drinks, mealsCategories, drinksCategories,
    selectedCategory, favChecked]);

  const fetchCategories = async (url, setFunc, key) => {
    const maxCategories = 5;
    const response = await fetch(url);
    const data = await response.json();
    data[key] = data[key]?.filter((_e, i) => i < maxCategories);
    setFunc(data);
  };

  useEffect(() => {
    fetchRecipes();
    fetchDrinks();
    fetchCategories('https://www.themealdb.com/api/json/v1/1/list.php?c=list', setMealsCategories, 'meals');
    fetchCategories('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list', setDrinksCategories, 'drinks');
  }, []);

  return (
    <RecipesContext.Provider value={ value }>
      {children}
    </RecipesContext.Provider>
  );
}

RecipesProvider.propTypes = {}.isRequired;
