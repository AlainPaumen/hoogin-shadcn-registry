import type { VariantProps } from 'class-variance-authority';
import { Badge, badgeVariants } from '@/components/ui/badge';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

type BadgeCellProps = {
    value: string;
    label?: string;
    labelByValue?: Record<string, string>;
    variant?: BadgeVariant;
    variantByValue?: Record<string, BadgeVariant>;
};

export function BadgeCell({ value, label, labelByValue, variant = 'secondary', variantByValue }: BadgeCellProps) {
    return <Badge variant={variantByValue?.[value] ?? variant}>{labelByValue?.[value] ?? label ?? value}</Badge>;
}
