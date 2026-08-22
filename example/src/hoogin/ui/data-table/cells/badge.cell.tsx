import type { VariantProps } from 'class-variance-authority';
import { Badge, badgeVariants } from '@/components/ui/badge';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

type BadgeCellProps = {
    value: string;
    variant?: BadgeVariant;
    variantByValue?: Record<string, BadgeVariant>;
};

export function BadgeCell({ value, variant = 'secondary', variantByValue }: BadgeCellProps) {
    return <Badge variant={variantByValue?.[value] ?? variant}>{value}</Badge>;
}
