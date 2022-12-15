import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
// import { MEALS_DETAILS_MOCK } from './helpers/drink_details_mock';

const startBtnDTI = 'start-recipe-btn';
const mealsID = '/meals/52977'; // receita Corba
const burekID = '/meals/53060'; // Burek

describe('Testando a renderização dos elementos de RecipeDetails', () => {
  test('Se ao clicar no card da receita redireciona para a pág. de detalhes pelo ID', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push('/meals'); });

    await screen.findByRole('heading', { name: /meals/i });

    const recipeCard = screen.findByTestId('0-recipe-card');
    expect(await recipeCard).toBeVisible();
    userEvent.click(await recipeCard);
    await waitFor(() => {
      expect(history.location.pathname).toBe(mealsID);
    });
  });
  test('Se renderiza os elementos do card na pág de detalhes', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(mealsID); });

    const recipeTitle = screen.findByTestId('recipe-title');
    expect(await recipeTitle).toBeInTheDocument();
    expect(await screen.findByText('Corba'));

    const img = screen.findByTestId('recipe-photo');
    expect(await img).toBeInTheDocument();

    const category = screen.findByTestId('recipe-category');
    expect(await category).toBeInTheDocument();
    expect(await screen.findByText('Side'));

    const ingredients = screen.findByTestId('0-ingredient-name-and-measure');
    expect(await ingredients).toBeInTheDocument();
    expect(await screen.findAllByText('Lentils1 cup')[0]);

    const instructions = screen.findByTestId('instructions');
    expect(await instructions).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.findByText(' Immediately add the lentils, water, broth, and salt. Bring the soup to a (gentle) boil.'));
    });

    const video = screen.findByTestId('video');
    expect(await video).toBeInTheDocument();

    const shareBtn = screen.findByTestId('share-btn');
    expect(await shareBtn).toBeInTheDocument();

    const favoriteBtn = screen.findByTestId('favorite-btn');
    expect(await favoriteBtn).toBeInTheDocument();
  });

  test('Se o botão Start Recipe redireciona para a página id/in-progress', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { 53060: 'test' } }));
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push(burekID);
    });
    expect(screen.findByRole('heading', { name: /Burek/i, level: 1 }));
    const startBtn = screen.findByTestId(startBtnDTI);
    userEvent.click(await startBtn);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals/53060/in-progress');
    });
  });

  test('Se o link da pág é copiado', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: () => { },
      },
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push(burekID);
    });

    expect(screen.findByRole('heading', { name: /Burek/i, level: 1 }));
    const shareBtn = screen.findByTestId('share-btn');
    userEvent.click(await shareBtn);
    expect(await screen.findByText(/link copied!/i));
  });

  test('Carrossel de sugestão de bebida', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(burekID); });

    const carrossel = screen.findByTestId('0-recommendation-card');
    expect(await carrossel).toBeVisible();
    expect(await screen.findByText('GG'));
    expect(await screen.findByText('A1'));
  });

  test('Se o iconHeart favorita a receita', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push(burekID);
    });
    const favoriteBtnIcon = await screen.findByRole('checkbox');

    setTimeout(() => {
      userEvent.click(favoriteBtnIcon);
      expect(favoriteBtnIcon).toHaveAttribute('src', 'blackHeartIcon.svg');
    });
    setTimeout(() => {
      userEvent.click(favoriteBtnIcon);
      expect(favoriteBtnIcon).toHaveAttribute('src', 'whiteHeartIcon.svg');
    });
  });
  test('Testando as linhas 47-68 local storage', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { 53060: 'test' } }));
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push(burekID);
    });
    const continueRecipe = await screen.findByRole('button', { name: /continue recipe/i });
    expect(continueRecipe).toBeInTheDocument();
  });
});
