import { useMemo, useState } from 'react';
import { getFromLocal } from '../services/storage';
import DetailsContext from './DetailsContext';

export default function DetailsProvider({ children }) {
  const [detailsRecipes, setDetailsRecipe] = useState({
    drinks: [],
    meals: [],
  });
  const [checked, setChecked] = useState({});

  const [ingredientes, setIngredientes] = useState([]);
  const [pound, setPound] = useState([]);

  const handleChecked = (ing, type, data) => {
    const obj = {};
    const local = typeof getFromLocal('inProgressRecipes')
    === 'string' ? false : getFromLocal('inProgressRecipes');
    const key = type === 'meals' ? 'idMeal' : 'idDrink';
    const recipes = local && !!local[type][data[key]]
      && local[type][data[key]];
    if (!local || !recipes
      || local[type][data[key]].length === 0) {
      ing.forEach((_e, i) => {
        obj[`checked${i}`] = false;
      });
    } else {
      ing.forEach((_e, i) => {
        obj[`checked${i}`] = recipes[0][`checked${i}`];
      });
    }

    setChecked(obj);
  };

  const FetchUrl = async (url, type) => {
    const response = await fetch(url);
    const data = await response.json();
    setDetailsRecipe(data);
    const recipes = Object.keys(data[type][0]).filter((e) => e.includes('strIngredient'));
    const newRecipes = recipes
      .map((e) => data[type][0][e])
      .filter((a) => a !== '' && a !== null);
    const ingredientPounds = Object.keys(data[type][0])
      .filter((e) => e.includes('strMeasure'));
    const newPound = ingredientPounds
      .map((e) => data[type][0][e])
      .filter((a) => a !== '' && a !== null);
    setIngredientes(newRecipes);
    setPound(newPound);
    handleChecked(newRecipes, type, data[type][0]);
  };

  const value = useMemo(() => ({
    ingredientes,
    setIngredientes,
    pound,
    setPound,
    detailsRecipes,
    setDetailsRecipe,
    FetchUrl,
    checked,
    setChecked,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ingredientes, pound, detailsRecipes, checked]);

  return (
    <DetailsContext.Provider
      value={ value }
    >
      {children}
    </DetailsContext.Provider>
  );
}
DetailsProvider.propTypes = {}.isRequired;
