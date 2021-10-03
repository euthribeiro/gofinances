import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import { 
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect, CategoryType } from '../CategorySelect';
import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './style';
import { Transaction } from '../Dashboard';
import { useAuth } from '../../hooks/auth';


interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O preço não pode ser negativo')
    .required('O Preço é obrigatório'),
});

export function Register() {

  const navigation = useNavigation();

  const { user } = useAuth();

  const { control, handleSubmit, formState: { errors }, reset  } = useForm({
    resolver: yupResolver(schema)
  });
  
  const [category, setCategory] = useState<CategoryType>({
    key: 'category',
    name: 'Categoria',
  });
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'up' | 'down'>('up');

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType) {
      Alert.alert('Tipo', 'Selecione o tipo da transação');
      return;
    }

    if(category.key === 'category') {
      Alert.alert('Categoria', 'Selecione a categoria');
      return;
    }

    const transaction: Transaction = {
      id: uuid.v4().toString(),
      type: transactionType,
      category: category.key,
      amount: form.amount,
      name: form.name,
      date: new Date().toString(),
    };

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const transactions: Transaction[] = data ? JSON.parse(data!) : [];

      const transactionsData = [
        ...transactions,
        transaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(transactionsData));

      reset();

      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      setTransactionType('up');

      navigation.navigate('Listagem');

    } catch(e) {
      Alert.alert('Transação', 'Não foi possível salvar a transação');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              control={control}
              name="name"
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
              error={errors.name && errors.name.message}
            />
            <InputForm 
              placeholder="Preço"
              control={control}
              name="amount"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton 
                title="Income"
                type="up"
                isActive={transactionType === 'up'}
                onPress={() => handleTransactionTypeSelect('up')}
              />
              <TransactionTypeButton 
                title="Outcome" 
                type="down"
                isActive={transactionType === 'down'}
                onPress={() => handleTransactionTypeSelect('down')}
              />
            </TransactionsTypes>
            <CategorySelectButton 
              testID="category-button"
              title={category.name} 
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
        <Modal testID="category-modal" animationType="slide" visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            closeCategory={handleCloseSelectCategoryModal}
            setCategory={setCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}