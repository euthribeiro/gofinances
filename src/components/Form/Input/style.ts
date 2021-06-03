import styled from 'styled-components/native';
import { TextInput } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(TextInput)`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.shape};

  padding: 16px 18px;
  margin-bottom: 8px;

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};

  border-radius: 5px;
`;