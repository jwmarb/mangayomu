import React from 'react';
import { ButtonProps } from './interfaces';

const Button: React.FC<ButtonProps> = ({ onClick, children, isSelected }) => (
  <button
    style={{
      border: 0,
      backgroundColor: isSelected ? 'rebeccapurple' : 'hotpink',
      color: isSelected ? 'white' : 'black',
      padding: '12px 24px',
      margin: '12px',
      borderRadius: '3px',
    }}
    onClick={onClick}>
    {children}
  </button>
);

export default Button;
