import React, { useContext } from 'react';
import { createContext, ReactNode } from 'react';
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: IUser;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  logout(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = createContext({} as IAuthContextData);

const userStorageKey = '@gofinances:user';

function AuthProvider({ children } : AuthProviderProps) {

  const [user, setUser] = useState<IUser>({} as IUser);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        iosClientId: '759333017741-5a0nhj9ej8rg2h0ikptuu8eqfs7u35uk.apps.googleusercontent.com',
        androidClientId: '759333017741-rbhhfj0kcr8dnclkrup3aqhk4gnmubpd.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });
  
      if(result.type === 'success') {
        const userLogged = {
          id: String(result.user.id),
          email: result.user.email!,
          name: result.user.name!,
          photo: result.user.photoUrl
        };

        setUser(userLogged);
  
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      } else {
        Alert.alert('Autenticação falhou', 'Não foi possível obter os dados de sua conta');
      }
    } catch(e) {
      throw new Error(e);
    }
  }
  
  async function signInWithApple() {
    try {
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ]
      });
    
      if(result) {
    
        const userLogged = {
          id: String(result.user),
          email: result.email!,
          name: result.fullName!.givenName!,
          photo: 'https://ui-avatars.com/api/?name=' + result.fullName?.givenName + result.fullName?.middleName + ' &background=FF872C&color=FFFFFF'
        };

        setUser(userLogged);
    
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      } else {
        Alert.alert('Autenticação falhou', 'Não foi possível obter os dados de sua conta');
      }
    
      
    } catch(e) {
      throw new Error(e);
    }
  }

  async function logout() {
    setUser({} as IUser);

    await AsyncStorage.removeItem(userStorageKey);
  }

  async function loadUser() {
    setUserStorageLoading(true);
    try {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if(userStoraged) {
        const user: IUser = JSON.parse(userStoraged);

        setUser(user);
      }

      setUserStorageLoading(false);

    } catch(e) {
      setUserStorageLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      logout,
      userStorageLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };