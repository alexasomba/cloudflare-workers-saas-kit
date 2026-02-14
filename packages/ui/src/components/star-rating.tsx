import * as React from 'react';
import { Star } from '@phosphor-icons/react';

import { cn } from '@workspace/ui/lib/utils';

export type StarRatingValue = 0 | 1 | 2 | 3 | 4 | 5;

const ratingLabels: Record<Exclude<StarRatingValue, 0>, string> = {
  1: 'Would not recommend',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

export function getStarRatingLabel(value: StarRatingValue): string {
  if (value === 0) return '';
  return ratingLabels[value];
}

export type StarRatingProps = {
  value: StarRatingValue;
  onChange: (next: StarRatingValue) => void;
  onHoverChange?: (next: StarRatingValue) => void;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
  starClassName?: string;
};

export function StarRating({
  value,
  onChange,
  onHoverChange,
  disabled = false,
  className,
  starClassName,
  'aria-label': ariaLabel = 'Rating',
}: StarRatingProps) {
  const [hover, setHover] = React.useState<StarRatingValue>(0);
  const active = hover || value;

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onMouseLeave={() => {
        setHover(0);
        onHoverChange?.(0);
      }}
      onKeyDown={(e) => {
        if (disabled) return;

        const move = (next: StarRatingValue) => {
          onChange(next);
          setHover(0);
          onHoverChange?.(0);
        };

        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          move((Math.max(0, value - 1) as StarRatingValue) ?? 0);
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          move((Math.min(5, value + 1) as StarRatingValue) ?? 5);
        }
        if (e.key === 'Home') {
          e.preventDefault();
          move(1);
        }
        if (e.key === 'End') {
          e.preventDefault();
          move(5);
        }
      }}
    >
      {([1, 2, 3, 4, 5] as const).map((n) => {
        const filled = active >= n;
        const checked = value === n;

        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            disabled={disabled}
            className={cn(
              'inline-flex items-center justify-center rounded-md transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:opacity-50'
            )}
            onMouseEnter={() => {
              setHover(n);
              onHoverChange?.(n);
            }}
            onClick={() => onChange(n)}
          >
            <Star
              weight={filled ? 'fill' : 'regular'}
              className={cn(
                'text-amber-500',
                filled ? 'fill-amber-500' : 'fill-transparent',
                starClassName
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
