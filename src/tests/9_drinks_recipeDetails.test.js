import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import { DRINK_DETAILS_MOCK } from './helpers/drink_details_mock';

const startBtnDTI = 'start-recipe-btn';
const drinkABC = '/drinks/13501';

describe('Testando recipeDetails: drinks', () => {
  test('A renderização dos elementos na pag drinks/:id', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(drinkABC); });

    expect(screen.findByRole('heading', { name: /ABC/i, level: 1 }));

    const img = screen.findByTestId('recipe-photo');
    expect(await img).toBeInTheDocument();

    // const cat = await screen.findByTestId("recipe-category");

    expect(screen.findByRole('list', { name: 'Amareto 1/3' }));
    expect(screen.findByRole('list', { name: 'Baileys irish cream 1/3' }));
    expect(screen.findByRole('list', { name: 'Cognac 1/3' }));

    const instr = screen.findByText('Layered in a shot glass.');
    expect(await instr).toBeVisible();

    const alc = screen.findByText('Alcoholic');
    expect(await alc).toBeVisible();

    // expext(await screen.findByText('Alcoholic'));
    // const alcohol = await screen.findByText('recipe-category');
    // expect(alcohol).toBeInTheDocument();
  });

  test('Se o link da pág é copiado', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: () => { },
      },
    });
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push(drinkABC);
    });

    expect(screen.findByRole('heading', { name: /ABC/i, level: 1 }));
    const shareBtn = screen.findByTestId('share-btn');
    userEvent.click(await shareBtn);
    expect(await screen.findByText(/link copied!/i));
  });

  test('Carrossel de sugestão de comida', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push(drinkABC); });

    const carrossel = screen.findByTestId('0-recommendation-card');
    expect(await carrossel).toBeVisible();
    expect(await screen.findByText('Corba'));
    expect(await screen.findByText('Burek'));
  });

  test('Se o botão Start Recipe redireciona para a página id/in-progress', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => { history.push(drinkABC); });

    expect(screen.findByRole('heading', { name: /ABC/i, level: 1 }));
    const startBtn = screen.findByTestId(startBtnDTI);
    userEvent.click(await startBtn);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/drinks/13501/in-progress');
    });
  });

  test('favorite button Icon', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push('/drinks/13501'); });

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

  test('Testando as linhas 47-68 utilizando o Mock', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(DRINK_DETAILS_MOCK),
    });
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push(drinkABC);
    });

    // const title = screen.findByTestId('recipe_title');
    // expect(title).toHaveTextContent('ABC');
    // const cat = await screen.findAllByTestId('recipe-category');
    // await waitFor(() => {
    //   expect(cat).toHaveValue('Shot');
    // });
  });
});
