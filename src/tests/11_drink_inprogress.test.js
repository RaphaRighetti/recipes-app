import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

const startBtnDTI = 'start-recipe-btn';
const inProgressURL = '/drinks/13501/in-progress';

describe('Testes relacionados a pág. in progress da fetchDrinks', () => {
  test('Se a pág in-progress é redirecionada de forma correta', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push('/drinks/13501'); });

    await screen.findByRole('heading', { name: /ABC/i });

    const startBtn = screen.findByTestId(startBtnDTI);
    userEvent.click(await startBtn);
    await waitFor(() => {
      expect(history.location.pathname).toBe(inProgressURL);
    });
  });
  test('A pág. in progress - reenderização dos elementos', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /ABC/i });

    const photo = screen.findByTestId('recipe-photo');
    expect(await photo).toBeInTheDocument();

    expect(await screen.findByText('Shot')).toBeVisible();

    const instructions = screen.findByText(/Layered in a shot glass./i);
    expect(await instructions).toBeVisible();

    const alcohol = screen.findByText(/Alcoholic/i);
    expect(await alcohol).toBeVisible();
  });

  test('Se a lista é riscada através do checked', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /ABC/i });

    const ingredients = screen.findByTestId('0-ingredient-name-and-measure');
    const ingredient = await screen.findAllByRole('checkbox');

    const finishRecipeBtn = screen.findByTestId('finish-recipe-btn');

    expect(await ingredients).toBeInTheDocument();
    expect(await screen.findAllByText('Amaretto1/3')[0]);
    expect(await screen.findAllByText('Baileys irish cream1/3')[1]);
    expect(await screen.findAllByText('Cognac1/3')[2]);

    setTimeout(() => {
      expect(finishRecipeBtn).toBeDisabled();
      fireEvent.click(screen.findAllByTestId('0-ingredient-step'));
      expect(ingredient).toBeChecked();
      expect(finishRecipeBtn).toBeEnabled();
    }, 3000);
    userEvent.click(await finishRecipeBtn);

    setTimeout(() => {
      expect(history.location.pathname).toBe('/drinks/13501/done-recipes');
    }, 3000);
  });

  test('Se o link da pág é copiado', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: () => { },
      },
    });
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /ABC/i });

    const shareBtn = screen.findByTestId('share-btn');
    userEvent.click(await shareBtn);
    expect(await screen.findByText(/link copied!/i));
  });

  test('O btn favorite', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /ABC/i });

    const favoriteBtnIcon = await screen.findByTestId('favorite-btn');

    setTimeout(() => {
      userEvent.click(favoriteBtnIcon);
      expect(favoriteBtnIcon).toHaveAttribute('src', 'blackHeartIcon.svg');
    });
    setTimeout(() => {
      userEvent.click(favoriteBtnIcon);
      expect(favoriteBtnIcon).toHaveAttribute('src', 'whiteHeartIcon.svg');
    });
  });
});

//   RecipeInProgress.js |   38.33 |    29.68 |   35.29 |   41.07 | 28,30,42-56,60-81,86-108,147-175,206;
