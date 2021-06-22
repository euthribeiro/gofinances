import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignTitle,
  Footer,
  FooterWrapper
} from './style';

import AppleSvg from '../../assets/images/apple.svg';
import GoogleSvg from '../../assets/images/google.svg';
import LogoSvg from '../../assets/images/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useTheme } from 'styled-components';

export function SignIn() {

  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      return;

    } catch(e) {
      Alert.alert('Autenticação', 'Autenticação falhou');

    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch(e) {
      Alert.alert('Autenticação', 'Autenticação falhou');
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>Controle suas {'\n'}finanças de forma {'\n'}muito simples</Title>
        </TitleWrapper>
        <SignTitle>Faça o seu login com {'\n'}uma das contas abaixos</SignTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
            title="Entrar com google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton 
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>
        {isLoading && <ActivityIndicator color={colors.shape} style={{
          marginTop: 20
        }} />}
      </Footer>
    </Container>
  )
}