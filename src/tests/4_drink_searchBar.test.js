import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import { DRINKS_MOCK, DRINK_MOCK_ID, FAIL_DRINKS_MOCK } from './helpers/mock_recipes';

const searchInputDti = 'search-input';
const firstLetterDti = 'first-letter-search-radio';
const nameDti = 'name-search-radio';
const ingredientsDti = 'ingredient-search-radio';
const btnSearchDti = 'exec-search-btn';
const btnIconDti = 'search-top-btn';
const alertMessage = 'Sorry, we haven\'t found any recipes for these filters.';

describe('Testando componente Drinks', () => {
  test('Verifique a busca por Drinks', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    expect(await screen.findByRole('heading', { name: /meals/i }));

    const mealBtnIcon = screen.getByTestId('meals-bottom-btn');
    const drinkBtnIcon = screen.getByTestId('drinks-bottom-btn');

    expect(mealBtnIcon).toBeInTheDocument();
    expect(drinkBtnIcon).toBeInTheDocument();
  });
  test('Se o iconDrinks redireciona para a pág. de drinks', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    const drinkBtnIcon = screen.getByTestId('drinks-bottom-btn');
    expect(drinkBtnIcon).toBeInTheDocument();
    expect(screen.getByText('Drinks')).toBeInTheDocument();
    userEvent.click(drinkBtnIcon);
    expect(history.location.pathname).toBe('/drinks');
  });

  test('Se o iconMeals redireciona para a pág. de meals', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    const mealBtnIcon = screen.getByTestId('meals-bottom-btn');
    expect(mealBtnIcon).toBeInTheDocument();
    expect(screen.getByText('Meals')).toBeInTheDocument();
    userEvent.click(mealBtnIcon);
    expect(history.location.pathname).toBe('/meals');
  });

  test('O campo de pesquisa para os Drinks', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(DRINKS_MOCK),
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    await screen.findByRole('heading', { name: /Drinks/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);
    const firstLetter = screen.findByTestId(firstLetterDti);
    const ingredient = screen.findByTestId(ingredientsDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'a');
    userEvent.click(await firstLetter);
    userEvent.click(await btnSearch);

    expect(await screen.findByText('A True Amaretto Sour'));

    userEvent.type(searchInput, '');
    userEvent.type(searchInput, 'lemon');
    userEvent.click(await ingredient);

    expect(await screen.findByText('California Lemonade'));

    const name = screen.findByTestId(nameDti);
    userEvent.type(searchInput, '');
    userEvent.type(searchInput, 'boston');
    userEvent.click(await name);

    expect(await screen.findByText(/Boston Sour/i));
  });

  test('Testando mensagem de erro, linhas 31 e 32 SearchBar', async () => {
    global.alert = jest.fn();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(FAIL_DRINKS_MOCK),
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    await screen.findByRole('heading', { name: /Drinks/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(searchInput, '');
    userEvent.click(await btnSearch);

    await waitFor(async () => {
      expect(global.alert).toBeCalledWith(alertMessage);
      expect(global.alert).toHaveBeenCalledTimes(1);
    });
  });
  test('Se a pag. renderiza com o id', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(DRINK_MOCK_ID),
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    await screen.findByRole('heading', { name: /Drinks/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    const name = screen.findByTestId(nameDti);
    userEvent.type(searchInput, 'A True Amaretto Sour');
    userEvent.click(await name);
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/drinks/17005');
    });
  });
});
