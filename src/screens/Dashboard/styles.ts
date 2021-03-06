import styled from 'styled-components/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'
import { Transaction } from './index'
import { FlatList, Platform } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View`
  width: 100%;
  background-color: ${({theme}) => theme.colors.primary};
  height: ${RFPercentage(42)}px;
`;

export const UserWrapper = styled.View`
  width: 100%;

  padding: 0 24px;
  margin-top: ${Platform.OS === 'android' ? RFValue(28) : getStatusBarHeight() + RFValue(28)}px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Photo = styled.Image`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: 10px;
`; 

export const User = styled.View`
  margin-left: 17px;
  flex: 1;
`;

export const UserGretting = styled.Text`
  color: ${({theme}) => theme.colors.shape};
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
`;

export const UserName = styled.Text`
  color: ${({theme}) => theme.colors.shape};
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${RFValue(18)}px;
`;

export const LogoutButton = styled(BorderlessButton)`
  
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(24)}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const HighlightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingLeft: 24,
    paddingRight: 8,
  },
})`
  width: 100%;
  position: absolute;
  margin-top: ${RFPercentage(20)}px;
`;

export const Transactions = styled.View`
  flex: 1;

  margin-top: ${RFPercentage(13)}px;
  padding: 0px 24px;
`;
export const Title = styled.Text`
  font-size: ${RFValue(18)}px;
  line-height: ${RFValue(27)}px;
  font-family: ${({theme}) => theme.fonts.regular};

  margin-bottom: 16px;
`;

export const TransactionList = styled(
  FlatList as new () => FlatList<Transaction[]>
).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: getBottomSpace()
  },
})`

`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
`;