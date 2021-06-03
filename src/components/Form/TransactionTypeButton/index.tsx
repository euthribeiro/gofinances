import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { 
  Container, 
  Icon, 
  Title,
  Button,
} from './style';

interface Props extends RectButtonProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

export function TransactionTypeButton({ title, type, isActive, ...rest } : Props) {
  return (
    <Container isActive={isActive} type={type}>
       <Button activeOpacity={0.8} {...rest}>
        <Icon 
          name={icons[type]}
          type={type}
        />
        <Title>
          {title}
        </Title>
      </Button>
    </Container>
  )
}