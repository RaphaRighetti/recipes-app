import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';

const allCategoriesFilterDTI = 'All-category-filter';

describe('Testando tela recipes para Drinks', () => {
  test('Se renderiza os botões categories Drinks', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/drinks');
    });
    expect(await screen.findByText('Drinks'));

    const allBtn = screen.findByTestId(allCategoriesFilterDTI);
    const ordinary = await screen.findByRole('button', { name: /Ordinary Drink/i });
    const cocktail = screen.findByRole('button', { name: /Cocktail/i });
    const shake = screen.findByRole('button', { name: /Shake/i });
    const other = screen.findByRole('button', { name: /Other/i });
    const cocoa = screen.findByRole('button', { name: 'Cocoa' });

    expect(await ordinary).toBeInTheDocument();
    expect(await allBtn).toBeInTheDocument();
    expect(await cocoa).toBeVisible();
    expect(await cocktail).toBeInTheDocument();
    expect(await shake).toBeInTheDocument();
    expect(await other).toBeInTheDocument();
  });

  test('A chamada da API - btnAll - Drinks', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    expect(await screen.findByText('Drinks'));

    const allBtn = screen.findByTestId(allCategoriesFilterDTI);
    userEvent.click(await allBtn);
    expect(await screen.findByText('GG'));

    const ordinary = await screen.findByRole('button', { name: /Ordinary Drink/i });
    userEvent.click(await ordinary);
    expect(await screen.findByText('3-Mile Long Island Iced Tea'));

    const cocktail = screen.findByRole('button', { name: /Cocktail/i });
    userEvent.click(await cocktail);
    expect(await screen.findByText('155 Belmont'));

    const shake = screen.findByRole('button', { name: /Shake/i });
    userEvent.click(await shake);
    expect(await screen.findByText('Avalanche'));

    const other = await screen.findByRole('button', { name: /Other/i });

    setTimeout(() => {
    }, 3000);
    userEvent.click(await other);
    expect(await screen.findByText('Absolut Evergreen'));

    const cocoa = screen.findByRole('button', { name: 'Cocoa' });
    userEvent.click(await cocoa);
    expect(await screen.findByText('Castillian Hot Chocolate'));

    expect(await screen.findByTestId('Cocktail-category-filter')).toBeInTheDocument();
    expect(await screen.findAllByTestId(/-category-filter/)).toHaveLength(6);
  });
  test('Se o botão Cocktail renderiza uma lista e se o botão all limpa o filtro', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    expect(await screen.findByText('Drinks'));

    const allBtn = screen.findByTestId(allCategoriesFilterDTI);
    const cocktail = screen.findByRole('button', { name: /Cocktail/i });
    userEvent.click(await cocktail);
    expect(await screen.findByText('155 Belmont'));
    userEvent.click(await allBtn);
    expect(await screen.findByText('GG'));
  });

  test('2.2. Testa se renderiza a lista de drinks com 12 itens.', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    expect(await screen.findByText('Drinks'));

    expect(await screen.findByTestId('0-card-name')).toBeInTheDocument();
    expect(await screen.findAllByTestId(/-card-name/)).toHaveLength(12);
  });

  test('Se o toggle quando selecionado novamente setorna as receitas sem filtro', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    expect(await screen.findByText('Drinks'));

    const cocktail = screen.findByRole('button', { name: /Cocktail/i });
    userEvent.click(await cocktail);
    expect(await screen.findByText('GG'));
    userEvent.click(await cocktail);
    expect(await screen.findByText('9 1/2 Weeks'));
  });

  test('Se redireciona a receita com o id', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    expect(await screen.findByText('Drinks'));

    const cocoa = screen.findByRole('button', { name: 'Cocoa' });
    userEvent.click(await cocoa);
    expect(await screen.findByText('Castillian Hot Chocolate'));
    const recipeCard = screen.findByTestId('0-recipe-card');
    userEvent.click(await recipeCard);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/drinks/12730');
    });
  });
});
