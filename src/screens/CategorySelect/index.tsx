import React from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../components/Form/Button';
import { categories } from '../../utils/categories';
import { 
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Divider,
  Footer,
} from './style';

export interface CategoryType {
  key: string;
  name: string;
}

interface Props {
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
  closeCategory: () => void;
}

export function CategorySelect({
  category,
  closeCategory,
  setCategory
} : Props) {

  function handleSelectCategory(item: CategoryType) {
    setCategory(item);
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
      <FlatList 
        data={categories}
        style={{flex: 1, width: '100%'}}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category 
            isActive={category.key === item.key}
            onPress={() => handleSelectCategory(item)}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
      <Footer>
        <Button title="Selecionar" onPress={closeCategory}/>
      </Footer>
    </Container>
  )
}