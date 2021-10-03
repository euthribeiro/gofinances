import React from 'react';
import { render } from '@testing-library/react-native';
import { Profile } from '../../screens/Profile';

describe('Profile screen', () => {
  it('should have the correct placeholder in user input name', () => {

    const { getByPlaceholderText } = render(<Profile />);

    const inputName = getByPlaceholderText('Nome');
  
    expect(inputName).toBeTruthy();
  });

  it('should be load user data', () => {
    const { getByTestId } = render(<Profile />);

    const inputName = getByTestId('input-name');
    const inputLastName = getByTestId('input-lastname');

    expect(inputName.props.value).toEqual('Thiago');
    expect(inputLastName.props.value).toEqual('Ribeiro');
  });

  it('should have the correct title', () => {

    const { getByTestId } = render(<Profile />)
 
    const textTitle = getByTestId('text-label-name');

    expect(textTitle.props.children).toEqual('Nome');
  });
});


