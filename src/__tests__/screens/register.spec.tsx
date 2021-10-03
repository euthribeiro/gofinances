import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';
import { Register } from '../../screens/Register';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => jest.fn()
 }));

const Provider: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Register screen', () => {

  it('category should be open when user click on button category', async () => {

    const { getByTestId } = render(<Register />, { wrapper: Provider });

    const categoryButton = getByTestId('category-button');
    const categoryModal = getByTestId('category-modal');

    fireEvent.press(categoryButton);

    await waitFor(() => {
      expect(categoryModal.props.visible).toBeTruthy();
    });
  });

});