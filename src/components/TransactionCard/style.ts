import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface TypeProps {
  type: 'up' | 'down';
}

export const Container = styled.View`
  background: ${({theme}) => theme.colors.shape};

  border-radius: 5px;

  padding: 17px 24px;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-family: ${({ theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  line-height: ${RFValue(21)}px;

  color: ${({theme}) => theme.colors.title};
`;
export const Amount = styled.Text<TypeProps>`
  font-family: ${({ theme}) => theme.fonts.regular};
  font-size: ${RFValue(20)}px;
  line-height: ${RFValue(30)}px;
  
  color: ${({ theme, type }) => 
    type === 'up' ? theme.colors.success : theme.colors.attention};

  margin-top: 2px;
`;
export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;

  margin-top: 19px;
`;
export const Category = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const Icon = styled(Feather)`
  color: ${({theme}) => theme.colors.text};
  font-size: ${RFValue(20)}px;
`;
export const CategoryName = styled.Text`
  font-family: ${({ theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  line-height: ${RFValue(21)}px;

  margin-left: 12px;

  color: ${({theme}) => theme.colors.text};
`;
export const Date = styled.Text`
  font-family: ${({ theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  line-height: ${RFValue(21)}px;

  color: ${({theme}) => theme.colors.text};
`;