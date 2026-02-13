import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/dialog';
import React from 'react';

expect.extend(matchers);

describe('Accessibility', () => {
  it('Button should have no violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('Input should have no violations', async () => {
    const { container } = render(<Input aria-label="Input" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('Dialog should have no violations', async () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
