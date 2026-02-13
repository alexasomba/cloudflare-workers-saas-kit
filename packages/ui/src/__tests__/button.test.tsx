import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../components/button';
import React from 'react';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button.className).toContain('bg-destructive');
  });

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: /small/i });
    expect(button.className).toContain('h-7');
  });

  it('renders as a link when variant is link', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button', { name: /link/i });
    expect(button.className).toContain('underline-offset-4');
  });
});
