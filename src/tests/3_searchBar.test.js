import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import { MEALS_MOCK, MEAL_MOCK_ID } from './helpers/mock_recipes';

const searchInputDti = 'search-input';
const firstLetterDti = 'first-letter-search-radio';
const nameDti = 'name-search-radio';
const ingredientsDti = 'ingredient-search-radio';
const btnSearchDti = 'exec-search-btn';
const btnIconDti = 'search-top-btn';
const alertMessage = 'Sorry, we haven\'t found any recipes for these filters.';

describe('Cobertura de 45% e 90% do componente SearchBar ', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ mock: 'mock_recipes' }),
    });
  });

  test('Verificando as renderizações do componente SearchBar', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });
    await screen.findByRole('heading', { name: /meals/i });

    const searchInput = screen.queryByTestId(searchInputDti);
    const name = screen.queryByTestId(nameDti);
    const firstLetter = screen.queryByTestId(firstLetterDti);
    const ingredient = screen.queryByTestId(ingredientsDti);
    const btnSearch = screen.queryByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    expect(searchInput).not.toBeInTheDocument();
    expect(name).not.toBeInTheDocument();
    expect(ingredient).not.toBeInTheDocument();
    expect(firstLetter).not.toBeInTheDocument();
    expect(btnSearch).not.toBeInTheDocument();
    expect(await iconSearch).toBeInTheDocument();
  });

  test('Se o campo de pesquisa digita o valor', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });
    await screen.findByRole('heading', { name: /meals/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);
    expect(await searchInput).toBeInTheDocument();

    expect(await searchInput).toBeVisible();
    userEvent.type(await searchInput, 'egg');
    expect(await searchInput).toHaveValue('egg');
  });

  test('Se as APIs são chamadas de forma correta de acordo com o campo de busca selecionado: searchInput e ingredient', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(MEALS_MOCK),
    });
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });
    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const ingredient = screen.findByTestId(ingredientsDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'egg');
    userEvent.click(await ingredient);
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=egg');
      expect(screen.getByText('Chivito uruguayo')).toBeVisible();
    });
  });

  test('Se as APIs são chamadas de forma correta de acordo com o campo de busca selecionado: searchInput e name', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(MEALS_MOCK),
    });
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });
    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);
    const name = screen.findByTestId(nameDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'beef');
    userEvent.click(await name);
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=beef');
      expect(screen.getByText('Beef Lo Mein')).toBeVisible();
    });
  });

  test('Se as APIs são chamadas de forma correta de acordo com o campo de busca selecionado: searchInput e firsLetter', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(MEALS_MOCK),
    });
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });
    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);
    const firstLetter = screen.findByTestId(firstLetterDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'c');
    userEvent.click(await firstLetter);
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?f=c');
      expect(screen.getByText('Cream Cheese Tart')).toBeVisible();
    });
  });

  test('Se selecionar o radio Name e digitar uma única letra retorna um alerta de mensagem: "Sorry, we havent found any recipes for these filters."', async () => {
    global.alert = jest.fn();

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    const searchInput = screen.findByTestId(searchInputDti);
    const name = screen.findByTestId(nameDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'a');
    userEvent.click(await name);
    userEvent.click(await btnSearch);

    waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMessage);
      expect(global.alert).toHaveBeenCalledTimes(1);
    });
  });

  test('Se selecionar o radio FirstLetter e digitar mais que uma única letra retorna um alerta de mensagem: "Your search must have only 1 (one) character"', async () => {
    global.alert = jest.fn();

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    const searchInput = screen.findByTestId(searchInputDti);
    const firstLetter = screen.findByTestId(firstLetterDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'aa');
    userEvent.click(await firstLetter);
    userEvent.click(await btnSearch);

    waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMessage);
      expect(global.alert).toHaveBeenCalledTimes(1);
    });
  });
  // testando API drinks
  test('Se selecionar o radio FirstLetter e digitar mais que uma única letra retorna um alerta de mensagem: "Your search must have only 1 (one) character"', async () => {
    const alertMessage1 = 'Your search must have only 1 (one) character';
    global.alert = jest.fn();

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    await screen.findByRole('heading', { name: /Drinks/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);
    const firstLetter = screen.findByTestId(firstLetterDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    userEvent.type(await searchInput, 'aa');
    userEvent.click(await firstLetter);
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMessage1);
      expect(global.alert).toHaveBeenCalledTimes(1);
    });
  });
  test('Se exibe sinal de alerta quando a pag. nao recebe parâmetros', async () => {
    global.alert = jest.fn();
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/meals');
    });

    await screen.findByRole('heading', { name: /Meals/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();
    userEvent.type(searchInput, '');
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMessage);
      expect(global.alert).toHaveBeenCalledTimes(1);
    });
  });
  test('Se a pag. renderiza com o id', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(MEAL_MOCK_ID),
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    await screen.findByRole('heading', { name: /Meals/i });

    const searchInput = screen.findByTestId(searchInputDti);
    const btnSearch = screen.findByTestId(btnSearchDti);
    const iconSearch = screen.findByTestId(btnIconDti);

    userEvent.click(await iconSearch);

    expect(await searchInput).toBeVisible();

    const name = screen.findByTestId(nameDti);
    userEvent.type(searchInput, 'Beef Lo Mein');
    userEvent.click(await name);
    userEvent.click(await btnSearch);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals/52952');
    });
  });
});
// https://stackoverflow.com/questions/55933105/how-to-mock-or-assert-whether-window-alert-has-fired-in-react-jest-with-typesc
// global.alert = jest.fn();
// expect(global.alert).toHaveBeenCalledTimes(1);
