import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components'

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
  LogoutButton,
  LoadContainer
} from './styles';

export interface Transaction extends TransactionCardProps {
  id: string;
}

interface Highlight {
  amount: string;
  lastTransaction: string;
}

interface HighlightProps {
  income: Highlight;
  outcome: Highlight;
  total: Highlight;
}

export function Dashboard() {
  const { colors } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [highlight, setHighlight] = useState<HighlightProps>({} as HighlightProps);

  function getLastTransaction(collection: Transaction[], type: 'up' | 'down') {

    const date = new Date(Math.max.apply(null,
      collection
      .filter(item => item.type === type)
      .map(item => new Date(item.date).getTime())
    ));

    return `${date.getDate()} de ${date.toLocaleString("pt-BR", { month: 'long' })}`;
  }

  async function loadTransactions() {
    try {
      const dataKey = '@gofinances:transactions';

      const data = await AsyncStorage.getItem(dataKey);
      const transactionsData: Transaction[] = data ? JSON.parse(data!) : [];

      const dataFormatted = transactionsData.map(
        item => {
        const amount = Intl.NumberFormat('pt-BR', {
          currency: 'BRL',
          style: 'currency'
        }).format(Number(item.amount));

        const dateFormatted = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          amount,
          date: dateFormatted,
          category: item.category,
          name: item.name,
          type: item.type
        };
      })

      setTransactions(dataFormatted);

      const { income, outcome } = transactionsData.reduce((entries, item) => {
        
        if(item.type === 'up') {
          entries.income += Number(item.amount);
        } else {
          entries.outcome += Number(item.amount);
        }

        return entries;
      }, {
        income: 0,
        outcome: 0
      });

      const lastTransactionIncome = getLastTransaction(transactionsData, 'up');
      const lastTransactionOutcome = getLastTransaction(transactionsData, 'down');

      const lastTransactionDate = new Date(
        Math.max.apply(
          null,
          transactionsData
          .map(item => new Date(item.date).getTime())
        )
      );

      const total = income - outcome;


      setHighlight({
        income: {
          amount: Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(income),
          lastTransaction: 'Última entrada dia ' + lastTransactionIncome
        },
        outcome: {
          amount: Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(outcome),
          lastTransaction: 'Última saída dia ' + lastTransactionOutcome
        },
        total: {
          amount: Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(total),
          lastTransaction: '01 à ' + `${lastTransactionDate.getDate()} de ${lastTransactionDate.toLocaleDateString('pt-BR', { month: 'long' })}`
        }
      })

      setIsLoading(false);
    } catch(e) {
      Alert.alert('Transações', 'Não foi possível carregar as transações');
    }
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  if(isLoading) {
    return (
      <LoadContainer>
        <ActivityIndicator color={colors.primary} size="large" />
      </LoadContainer>
    )
  }

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
          <LogoutButton
            onPress={() => {}}
          >
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard 
          title="Entradas" 
          amount={highlight.income.amount}
          lastTransaction={highlight.income.lastTransaction}
          type="up"
        />
        <HighlightCard 
          title="Saídas"
          amount={highlight.outcome.amount}
          lastTransaction={highlight.outcome.lastTransaction}
          type="down"
        />
        <HighlightCard 
          title="Total"
          amount={highlight.total.amount}
          lastTransaction={highlight.total.lastTransaction}
          type="total"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionList 
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}