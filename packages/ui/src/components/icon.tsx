import type { IconProps } from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { ElementType } from 'react';

export interface IconWrapperProps extends Omit<IconProps, 'ref'> {
  icon: ElementType;
}

export function Icon({ icon: IconComponent, className, ...props }: IconWrapperProps) {
  return <IconComponent className={cn('shrink-0', className)} {...props} />;
}
