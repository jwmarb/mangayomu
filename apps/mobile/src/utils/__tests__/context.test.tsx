import React from 'react';
import { createContext } from '../context';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';

describe('createContext', () => {
  it('should return the default value when no provider is used', () => {
    const defaultValue = 'default';
    const { Provider, useContext } = createContext<string, string>(
      false,
      defaultValue,
    );

    function TestComponent() {
      const ctx = useContext();
      return <Text testID="text">{ctx}</Text>;
    }

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('text')).toHaveTextContent(defaultValue);
  });

  it('should return the provided value when a provider is used', () => {
    const providedValue = 'provided';
    const defaultValue = 'default';
    const { Provider, useContext } = createContext<string, string>(
      false,
      defaultValue,
    );

    function TestComponent() {
      const ctx = useContext();
      return <Text testID="text">{ctx}</Text>;
    }

    const { getByTestId } = render(
      <Provider value={providedValue}>
        <TestComponent />
      </Provider>,
    );
    expect(getByTestId('text')).toHaveTextContent(providedValue);
  });

  it('should throw an error when the context is null and throwOnNull is true', () => {
    const { useContext } = createContext<string>();

    function TestComponent() {
      return <View>{useContext()}</View>;
    }

    expect(() => render(<TestComponent />)).toThrow(InvalidUseContextException);
  });

  it('should not throw an error when the context is null and throwOnNull is false', () => {
    const defaultValue = null;
    const { useContext } = createContext<string>(false, defaultValue);

    function TestComponent() {
      const ctx = useContext();
      return <View>{ctx}</View>;
    }

    expect(() => render(<TestComponent />)).not.toThrow(
      InvalidUseContextException,
    );
  });

  it('should work with complex types', () => {
    interface ComplexType {
      name: string;
      age: number;
    }

    const defaultValue: ComplexType = { name: 'defaultName', age: 0 };
    const providedValue: ComplexType = { name: 'providedName', age: 30 };

    const { Provider, useContext } = createContext<ComplexType, ComplexType>(
      false,
      defaultValue,
    );

    function TestComponent() {
      const ctx = useContext();
      return (
        <View>
          <Text testID="1">Name: {ctx.name}</Text>
          <Text testID="2">Age: {ctx.age}</Text>
        </View>
      );
    }

    const { getByTestId } = render(
      <Provider value={providedValue}>
        <TestComponent />
      </Provider>,
    );

    expect(getByTestId('1')).toHaveTextContent('Name: providedName');
    expect(getByTestId('2')).toHaveTextContent('Age: 30');
  });
});
