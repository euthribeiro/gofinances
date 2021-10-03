import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { logInAsync } from 'expo-google-app-auth';

import { AuthProvider, useAuth } from '../../hooks/auth';

// jest.mock('expo-google-app-auth', () => {
//   return {
//     logInAsync: () => ({
//       type: 'success',
//       user: {
//         id: 'teste',
//         name: 'Thiago',
//         givenName: 'Ribeiro',
//         familyName: 'Rodrigues',
//         photoUrl: 'https://google.com',
//         email: 'thiago.r.ribeiro16@gmail.com'
//       }
//     })
//   }
// });

jest.mock('expo-google-app-auth');

describe('Auth hook', () => {

  it('should be able to sign in with an existing account', async () => {

    const googleMocked = mocked(logInAsync as any);

    googleMocked.mockReturnValueOnce({
      type: 'success',
      user: {
        id: 'teste',
        name: 'Thiago',
        givenName: 'Ribeiro',
        familyName: 'Rodrigues',
        photoUrl: 'https://google.com',
        email: 'thiago.r.ribeiro16@gmail.com'
      }
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).toBeTruthy();

    expect(result.current.user.email).toBe('thiago.r.ribeiro16@gmail.com');

  });

  it('should not be able to sign in with google', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    const googleMocked = mocked(logInAsync as any);

    googleMocked.mockReturnValueOnce({
      type: 'cancel'
    });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user)
      .not
      .toHaveProperty('id');
  });
})