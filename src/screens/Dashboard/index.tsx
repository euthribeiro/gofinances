import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGretting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {

  const data: DataListProps[] = [{
    id: '1',
    type: 'up',
    amount: "R$ 12.000,00",
    title: "Desenvolvimento de sites",
    category: {
      icon: 'dollar-sign',
      name: 'Vendas'
    },
    date: "05/04/2020"
  },{
    id: '2',
    type: 'down',
    amount: "R$ 59,00",
    title: "Hamburguer Pizzy",
    category: {
      icon: 'coffee',
      name: 'Alimentação'
    },
    date: "10/04/2020"
  },{
    id: '3',
    type: 'down',
    amount: "R$ 1.200,00",
    title: "Aluguem do apartamento",
    category: {
      icon: 'shopping-bag',
      name: 'Casa'
    },
    date: "10/04/2020"
  }];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{uri: 'https://avatars.githubusercontent.com/u/36652917?s=400&u=162ebd4607d72e5b84b4f699d07ca3f1517ab7e2&v=4.png'}} />
            <User>
              <UserGretting>Olá,</UserGretting>
              <UserName>Thiago</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard 
          title="Entradas" 
          amount="R$ 17.400,00" 
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard 
          title="Saídas"
          amount="R$ 10.000,00"
          lastTransaction="Última saída dia 13 de abril"
          type="down"
        />
        <HighlightCard 
          title="Total"
          amount="R$ 7.400,00"
          lastTransaction="01 à 16 de abril"
          type="total"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionList 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}