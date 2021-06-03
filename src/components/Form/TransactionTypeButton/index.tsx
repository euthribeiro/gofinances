import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { 
  Container, 
  Icon, 
  Title,
} from './style';

interface Props extends TouchableOpacityProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

export function TransactionTypeButton({ title, type, ...rest } : Props) {
  return (
    <Container 
      activeOpacity={0.8}
     type={type}
     {...rest}>
      <Icon 
        name={icons[type]}
        type={type}
      />
      <Title>
        {title}
      </Title>
    </Container>
  )
}