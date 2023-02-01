import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AppNavigator from '../components/AppNavigator';

// code and inspiration: https://callstack.github.io/react-native-testing-library/docs/react-navigation/

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
// Use with React Native <= 0.63
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// Use this instead with React Native >= 0.64
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Testing react navigation', () => {
  
  test('clicking on register takes you to the new screen', async () => {
    const component = (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    render(component);
    const toClick = await screen.findByText("Don't have an account? Sign up");

    fireEvent(toClick, 'press');
    const newButton = await screen.findByText('Sign up');

    expect(newButton).toBeTruthy();
  });
});

// log in with wrong and log in with right users