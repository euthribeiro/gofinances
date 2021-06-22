import React, { useCallback, useState } from 'react';
import  { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HistoryCard } from '../../components/HistoryCard';
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadingContainer,
} from './style';
import { Transaction } from '../Dashboard';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/auth';

interface TotalByCategory {
  key: string;
  total: number;
  totalFormatted: string;
  category: string;
  color: string;
  percent: number;
  percentFormatted: string;
}

export function Resume() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<TotalByCategory[]>([]);

  function handleDateChange(action: 'next' | 'previous') {
    if(action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else if(action === 'previous') {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    
    setIsLoading(true);

    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const data = await AsyncStorage.getItem(dataKey);
    const transactions: Transaction[] = data ? JSON.parse(data!) : [];

    const expensives = transactions.filter(
      expensive => expensive.type === 'down' &&
      new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const totalByCategory: TotalByCategory[] = [];

    const totalExpensive = expensives
      .reduce((accumulator, expensive) => {
        return accumulator + Number(expensive.amount);
      }, 0);

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if(expensive.category === category.key) {
          categorySum+= Number(expensive.amount);
        }
      });

      if(categorySum > 0) {

        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = (categorySum / totalExpensive * 100);
        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          category: category.name,
          totalFormatted: total,
          total: categorySum,
          color: category.color,
          percent,
          percentFormatted
        });
      }
    });

    setTotalByCategories(totalByCategory);

    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
        <Header>
          <Title>Resumo por categoria</Title>
        </Header>
        <Content 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: useBottomTabBarHeight(),
            paddingHorizontal: 24,
            flexGrow: 1
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('previous')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>{format(selectedDate, 'MMMM, yyyy', {
              locale: ptBR
            })}</Month>
            <MonthSelectButton onPress={() => handleDateChange('next')}>
            <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          {isLoading ? (
            <LoadingContainer>
              <ActivityIndicator color={colors.primary} size="large" />
            </LoadingContainer>
          ) : (
            <>
              <ChartContainer>
                <VictoryPie
                  x="percentFormatted"
                  y="total"
                  style={{
                    labels: {
                      fontSize: RFValue(18),
                      fontWeight: 'bold',
                      fill: colors.shape
                    }
                  }}
                  labelRadius={55}
                  colorScale={totalByCategories.map(item => item.color)}
                  data={totalByCategories}
                />
              </ChartContainer>
              {totalByCategories.map(item => (
                <HistoryCard 
                  key={item.key}
                  title={item.category}
                  amount={item.totalFormatted}
                  color={item.color}
                />
              ))}
            </>
          )}
        </Content>       
    </Container>
  )
}