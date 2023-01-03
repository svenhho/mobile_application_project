import * as React from 'react';
import { NavigationContainer, usePreventRemoveContext } from '@react-navigation/native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Register from './Register';
import { isValidTimestamp } from '@firebase/util';

// code and inspiration: https://callstack.github.io/react-native-testing-library/docs/react-navigation/

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
// Use with React Native <= 0.63
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// Use this instead with React Native >= 0.64
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Create new user', () => {

  test('Fill in form and create user', async () => {
    const component = (
        <Register />
    );

    render(component);

    const toClick = await screen.findByText('Register');
    
    expect(toClick).toBeTruthy();
  });

});
