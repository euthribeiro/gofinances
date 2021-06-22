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
import { useAuth } from '../../hooks/auth';

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
  const { logout, user } = useAuth();


  function getLastTransaction(collection: Transaction[], type: 'up' | 'down') {

    if(collection.length === 0) return 0;

    const date = new Date(Math.max.apply(null,
      collection
      .filter(item => item.type === type)
      .map(item => new Date(item.date).getTime())
    ));

    return `${date.getDate()} de ${date.toLocaleString("pt-BR", { month: 'long' })}`;
  }

  async function loadTransactions() {
    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;

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

      const lastTransactionIncomePhrase = lastTransactionIncome === 0 ?
      'Não há transaçãoes' : 'Última entrada dia ' + lastTransactionIncome;

      const lastTransactionOutcomePhrase = lastTransactionOutcome === 0 ?
      'Não há transaçãoes' : 'Última entrada dia ' + lastTransactionOutcome;

      const lastTransactionDatePhrase = transactionsData.length === 0 ?
      'Não há transaçãoes' : '01 à ' + `${lastTransactionDate.getDate()} de ${lastTransactionDate.toLocaleDateString('pt-BR', { month: 'long' })}`;

      setHighlight({
        income: {
          amount: Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(income),
          lastTransaction: lastTransactionIncomePhrase
        },
        outcome: {
          amount: Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(outcome),
          lastTransaction: lastTransactionOutcomePhrase
        },
        total: {
          amount: Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(total),
          lastTransaction: lastTransactionDatePhrase
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
            <Photo source={{ uri: user.photo }} />
            <User>
              <UserGretting>Olá,</UserGretting>
              <UserName numberOfLines={1} ellipsizeMode="tail">{user.name}</UserName>
            </User>
          </UserInfo>
          <LogoutButton
            onPress={logout}
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