import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-700 text-white shadow-sm',
        secondary:
          'border-transparent bg-secondary-100 text-secondary-800',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm',
        outline:
          'border-primary-300 text-primary-700',
        success:
          'border-transparent bg-nature-100 text-nature-800',
        warning:
          'border-transparent bg-cream-100 text-cream-800',
        coffee:
          'border-transparent bg-coffee-100 text-coffee-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
