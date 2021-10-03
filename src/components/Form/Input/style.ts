import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';

interface IContainer {
  active: boolean;
}

export const Container = styled(TextInput)<IContainer>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.shape};

  padding: 16px 18px;
  margin-bottom: 8px;

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};

  ${({ active, theme }) => active && css`
    border-color: ${theme.colors.attention};
    border-width: 3px;
  `};

  border-radius: 5px;
`;