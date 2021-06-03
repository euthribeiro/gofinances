import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { 
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
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

  const { control, handleSubmit, formState: { errors }  } = useForm({
    resolver: yupResolver(schema)
  });
  
  const [category, setCategory] = useState<CategoryType>({
    key: 'category',
    name: 'Categoria',
  });
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('up');

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleRegister(form: FormData) {
    if(!transactionType) {
      Alert.alert('Selecione o tipo da transação');
      return;
    }

    if(category.key === 'category') {
      Alert.alert('Selecione a categoria');
      return;
    }

    console.log(form);
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
              title={category.name} 
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
        <Modal animationType="slide" visible={categoryModalOpen}>
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