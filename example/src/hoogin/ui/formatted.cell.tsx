interface FormattedCellProps<T extends React.ReactNode> {
    value: T;
    format?: (value: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
}

export function FormattedCell<T extends React.ReactNode>({
    value,
    format,
    align = 'left'
}: FormattedCellProps<T>) {
    const alignmentClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

    return (
        <div className={alignmentClass}>
            <p className="text-muted-foreground text-sm font-light">
                {format ? format(value) : value}
            </p>
        </div>
    );
}