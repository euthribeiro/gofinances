import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(TouchableOpacity).attrs({
  activeOpacity: .7,
})`
  background-color: ${({ theme }) => theme.colors.shape};

  padding: 16px 18px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-radius: 5px;
`;

export const Category = styled.Text`
  font-family: ${({ theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${({ theme }) => theme.colors.text};
`;
export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
`;