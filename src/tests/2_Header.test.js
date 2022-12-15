import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

describe('Testando a Header 45 e 90% de cobertura', () => {
  test('Renderização de do botão de perfil', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => history.push('/meals'));

    await screen.findByText('Meals');

    const btnPro = screen.getByTestId('profile-top-btn');
    expect(btnPro).toBeInTheDocument();
    userEvent.click(btnPro);
    expect(history.location.pathname).toBe('/profile');

    const title = screen.getByText('Profile');
    expect(title).toBeInTheDocument();
  });

  test('A renderização e funcionalidade do input Search', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => history.push('/meals'));

    const searchInput = screen.queryByTestId('search-input');
    expect(searchInput).toBe(null);

    expect(await screen.findByTestId('search-top-btn')).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('search-top-btn'));

    waitFor(() => {
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue(''); // linha 23
      userEvent.type((searchInput, 'chiken'));
      userEvent.click(screen.getByTestId(radio));
      userEvent.click(screen.getByTestId('exec-search-btn'));
      expect(searchInput).toHaveValue('chicken');
      expect(searchInput).screen.getByText('chiken');
    });
  });
});

// const searchInput = screen.queryByTestId('search-input');
// // expect(searchInput).toBe(null);
// // expect(searchInput).not.toBeVisible();

// const iconSearch = screen.findByTestId('search-top-btn');
// expect(await iconSearch).toBeInTheDocument();
// userEvent.click(await iconSearch);

// expect(searchInput).toBeInTheDocument();
// userEvent.type(searchInput, 'chiken');
// expect(searchInput).toHaveValue('chiken');
// userEvent.click(screen.getByTestId('exec-search-btn'));
// expect(screen.findByText('Chicken Handi'));
// await new Promise((r) => { setTimeout(r, 2000); });
