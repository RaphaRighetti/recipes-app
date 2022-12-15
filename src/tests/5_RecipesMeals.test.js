import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import { DRINKS_MOCK, MEALS_MOCK } from './helpers/mock_recipes';

const allCategoriesFilterDTI = 'All-category-filter';
// const fiveCategories = ['All', 'Beef', 'Breakfast', 'Chicken', 'Dessert', 'Goat'];

describe('Testando o componente Recipes', () => {
  test('A chamada da API - btnAll - Meals', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    expect(await screen.findByText('Meals'));

    const allBtn = screen.findByTestId('All-category-filter');
    const beef = screen.findByRole('button', { name: /Beef/i });
    userEvent.click(await beef);
    expect(await screen.findByText('Beef and Mustard Pie'));
    userEvent.click(await allBtn);
    expect(await screen.findByText('Corba'));
  });

  test('A chamada da API - btnAll - Breakfast', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    expect(await screen.findByText('Meals'));
    const breakfast = screen.findByRole('button', { name: /breakfast/i });
    userEvent.click(await breakfast);
    expect(await screen.findByText('Breakfast Potatoes'));
  });

  test('A chamada da API - btnAll - Chicken', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    expect(await screen.findByText('Meals'));
    const chicken = screen.findByRole('button', { name: /chicken/i });
    userEvent.click(await chicken);
    expect(await screen.findByText('Ayam Percik'));
  });

  test('A chamada da API - btnAll - Dessert', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    expect(await screen.findByText('Meals'));
    const dessert = screen.findByRole('button', { name: 'Dessert' });
    userEvent.click(await dessert);
    expect(await screen.findByText('Apam balik'));
  });

  test('A chamada da API - btnAll - Goat', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    expect(await screen.findByText('Meals'));
    const goat = screen.findByRole('button', { name: /goat/i });
    userEvent.click(await goat);
    expect(await screen.findByText('Mbuzi Choma (Roasted Goat)'));

    expect(await screen.findByTestId('Goat-category-filter')).toBeInTheDocument();
    expect(await screen.findAllByTestId(/-category-filter/)).toHaveLength(6);
  });

  test('Se o toggle quando selecionado novamente retorna as receitas sem filtro', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    expect(await screen.findByText('Meals'));

    const beef = screen.findByRole('button', { name: /Beef/i });
    userEvent.click(await beef);
    expect(await screen.findByText('Beef and Mustard Pie'));
    userEvent.click(await beef);
    expect(await screen.findByText('Corba'));
  });

  test('', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    expect(await screen.findByText('Meals'));

    const chicken = screen.findByRole('button', { name: /chicken/i });
    userEvent.click(await chicken);
    expect(await screen.findByText('Ayam Percik'));
    const recipeCard = screen.findByTestId('0-recipe-card');
    userEvent.click(await recipeCard);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals/53050');
    });
  });

  test('A chamada da API - btnAll - Meals', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(MEALS_MOCK),
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    expect(await screen.findByText('Meals'));

    const allBtn = screen.findByTestId(allCategoriesFilterDTI);
    userEvent.click(await allBtn);

    expect(await screen.findByText('Cream Cheese Tart'));

    await waitFor(async () => {
      expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    });

    setTimeout(() => {
      for (let i = 0; i < 12; i += 1) {
        const img = screen.findByTestId(`${i}-card-img`);
        expect(img).toBeInTheDocument();
      }
    }, 2000);
  });
  test('A chamada da API - btnAll - Drinks', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(DRINKS_MOCK),
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    expect(await screen.findByText('Drinks'));

    const allBtn = screen.findByTestId(allCategoriesFilterDTI);
    userEvent.click(await allBtn);

    expect(await screen.findByText('California Lemonade'));

    await waitFor(async () => {
      expect(fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    });

    setTimeout(() => {
      for (let i = 0; i < 12; i += 1) {
        const img = screen.findByTestId(`${i}-recipe-card`);
        expect(img).toBeInTheDocument();
      }
    }, 2000);
  });
});
