import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Checkbox from '@/components/primitives/Checkbox'; // Adjust the import path as necessary

describe('Checkbox', () => {
  it('should render correctly with default props', () => {
    const { getByTestId } = render(<Checkbox testID="checkbox" />);
    expect(getByTestId('checkbox')).toBeDefined();
  });

  it('should call onCheck when pressed', () => {
    const mockOnCheck = jest.fn();
    const { getByTestId } = render(
      <Checkbox onCheck={mockOnCheck} testID="checkbox" />,
    );
    fireEvent.press(getByTestId('checkbox'));
    expect(mockOnCheck).toHaveBeenCalledWith(true);
  });

  it('should be checked when checked prop is true', () => {
    const { getByTestId } = render(
      <Checkbox checked={true} testID="checkbox" />,
    );
    expect(getByTestId('__checkbox_check__')).toHaveProp('style', undefined);
  });

  it('should not be checked when checked prop is false', () => {
    const { getByTestId } = render(<Checkbox checked={false} />);
    expect(getByTestId('__checkbox_check__')).toHaveStyle({
      fontSize: 16,
      color: 'rgba(255, 255, 255, 1)',
      opacity: 0,
    });
  });
});
