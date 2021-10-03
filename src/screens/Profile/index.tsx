import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export function Profile(){
  return (
    <View>
      <Text testID="text-label-name">
        Nome
      </Text>
      <TextInput 
        testID="input-name"
        placeholder="Nome"
        value="Thiago"
      />
      <Text>Sobrenome</Text>
      <TextInput 
        testID="input-lastname"
        placeholder="Sobrenome"
        value="Ribeiro"
      />
      <Button title="Enviar" onPress={() => {}} />
    </View>
  );
}