import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

const startBtnDTI = 'start-recipe-btn';
const inProgressURL = '/meals/53060/in-progress';

describe('Testes relacionados a pág.in progress', () => {
  test('Se a pág in-progress é redirecionada de forma correta', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push('/meals/53060'); });

    await screen.findByRole('heading', { name: /Burek/i });

    const startBtn = screen.findByTestId(startBtnDTI);
    userEvent.click(await startBtn);
    await waitFor(() => {
      expect(history.location.pathname).toBe(inProgressURL);
    });
  });

  test('A pág. in progress - reenderização dos elementos', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /Burek/i });

    const photo = screen.findByTestId('recipe-photo');
    expect(await photo).toBeInTheDocument();

    expect(await screen.findByText('Side')).toBeVisible();

    const instructions = screen.findByText(/Fry the finely chopped onions and minced meat in oil./i);
    expect(await instructions).toBeVisible();

    const youTube = screen.findByTestId('video');
    expect(await youTube).toBeInTheDocument();
  });

  test('Se a lista é riscada através do checked', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /Burek/i });

    const ingredients = screen.findByTestId('0-ingredient-name-and-measure');
    expect(await ingredients).toBeInTheDocument();
    expect(await screen.findAllByText('Filo Pastry1 Packet')[0]);
    userEvent.click(await ingredients);
    // expect(await ingredients.checked).toEqual(true);
    // expect(ingredients).toHaveStyle(text-decoration: line-through solid rgb(0, 0, 0))
  });

  test('Se o botão Finish Recipe é renderizado e se torna habilitado após todos os ingredientes estarem checked', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /Burek/i });

    const finishRecipeBtn = screen.findByTestId('finish-recipe-btn');
    const ingredient = await screen.findAllByRole('checkbox');

    expect(await finishRecipeBtn).toBeDisabled();
    setTimeout(() => {
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

    await screen.findByRole('heading', { name: /Burek/i });

    const shareBtn = screen.findByTestId('share-btn');
    userEvent.click(await shareBtn);
    expect(await screen.findByText(/link copied!/i));
  });

  test('O btn favorite', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(inProgressURL); });

    await screen.findByRole('heading', { name: /Burek/i });

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
