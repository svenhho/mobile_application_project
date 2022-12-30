import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';
import renderer from 'react-test-renderer';

// Use this instead with React Native >= 0.64
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('<App />', () => {
  test('simple check to see if it renders', () => {
    const tree = (
        <App />
    );
    
    render(tree);

    expect(tree).toBeTruthy();
  });


  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
