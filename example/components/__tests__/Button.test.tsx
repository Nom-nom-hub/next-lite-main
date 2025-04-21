import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByTestId('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Click me');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByTestId('button');
    
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    const buttonElement = screen.getByTestId('button');
    
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies correct variant class', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveClass('primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveClass('secondary');
    
    rerender(<Button variant="outline">Outline</Button>);
    buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveClass('outline');
  });

  test('applies correct size class', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveClass('small');
    
    rerender(<Button size="medium">Medium</Button>);
    buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveClass('medium');
    
    rerender(<Button size="large">Large</Button>);
    buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveClass('large');
  });

  test('sets the correct button type', () => {
    const { rerender } = render(<Button type="button">Button</Button>);
    let buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveAttribute('type', 'button');
    
    rerender(<Button type="submit">Submit</Button>);
    buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveAttribute('type', 'submit');
    
    rerender(<Button type="reset">Reset</Button>);
    buttonElement = screen.getByTestId('button');
    expect(buttonElement).toHaveAttribute('type', 'reset');
  });
});
