import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

describe('Testando componente: 1.FiltersBtns.js; 2.Done-Recipes ', () => {
  const doneRecipes = [
    {
      id: '52771',
      type: 'meal',
      nationality: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: '',
      name: 'Spicy Arrabiata Penne',
      image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
      doneDate: '23/06/2020',
      tags: ['Pasta', 'Curry'],
    },
    {
      id: '178319',
      type: 'drink',
      nationality: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'Aquamarine',
      image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
      doneDate: '23/06/2020',
      tags: [],
    },
  ];
  beforeEach(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('1.1 - renderizando os botões ', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push('/done-recipes'); });

    const allBtn = screen.findByTestId('filter-by-all-btn');
    const mealBtn = screen.findByTestId('filter-by-meal-btn');
    const drinkBtn = screen.findByTestId('filter-by-drink-btn');

    expect(await allBtn).toBeInTheDocument();
    expect(await mealBtn).toBeInTheDocument();
    expect(await drinkBtn).toBeInTheDocument();

    setTimeout(() => {
      userEvent.click(allBtn);
      userEvent.click(mealBtn);
      userEvent.click(drinkBtn);
    }, 3000);
  });

  describe('2.Todos os data-testids estão presentes em done-recipes', () => {
    // test('2.1 - ', async () => {
    //   const { history } = renderWithRouter(<App />);
    //   act(() => { history.push('/done-recipes'); });

    //   expect(await screen.findByText(/Done Recipes/i)).toBeInTheDocument();

    //   const imgCard = await screen.findAllByTestId('0-horizontal-image');
    //   expect(imgCard).toBeInTheDocument();

    //   const textCard = await screen.findAllByTestId('0-horizontal-top-text');
    //   expect(textCard)[0].toBeInTheDocument();

    //   const nameCard = await screen.findAllByTestId('0-horizontal-name');
    //   expect(nameCard)[0].toBeInTheDocument();

    //   const dataCard = await screen.findAllByTestId('0-horizontal-done-date');
    //   expect(dataCard)[0].toBeInTheDocument();

    //   const btnShare = await screen.findAllByTestId('0-horizontal-share-btn');
    //   expect(btnShare)[0].toBeInTheDocument();

    //   const tag = await screen.findAllByTestId('0-Pasta-horizontal-tag');
    //   expect(tag)[0].toBeInTheDocument();
    // });
  });
});

// ref: https://robertmarshall.dev/blog/how-to-mock-local-storage-in-jest-tests/
