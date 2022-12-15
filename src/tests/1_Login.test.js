import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import { getFromLocal } from '../services/storage';

describe('Req1. atingir 90% de cobertura em todo o teste', () => {
  test('Testando pagina de login', async () => {
    const { history } = renderWithRouter(<App />);
    const email = screen.getByPlaceholderText(/Digite seu email/i);
    expect(email).toBeInTheDocument();

    const password = screen.getByTestId('password-input');
    userEvent.type(password, '1234567');

    const buttonLogin = screen.getByRole('button', { name: /enter/i });
    expect(buttonLogin).toBeInTheDocument();
    expect(buttonLogin).toBeDisabled();

    userEvent.type(email, 'test@gmail.com');

    expect(buttonLogin).not.toBeDisabled();

    userEvent.click(buttonLogin);

    const title = screen.getByTestId(/page-title/i);
    expect(title).toBeInTheDocument();

    // history.push('/meals');
    // await waitForElementToBeRemoved(buttonLogin, { timeout: 2000 });
    expect(history.location.pathname).toBe('/meals');

    const testLocalStorage = getFromLocal('user');
    expect(testLocalStorage.email).toBe('test@gmail.com');

    const testLocalStorage1 = getFromLocal('Karol');
    expect(testLocalStorage1).toBe('Não foi encontrada a chave Karol');
  });
});
