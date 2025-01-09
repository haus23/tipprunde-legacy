export type MergeElementProps<
  T extends React.ElementType,
  P extends object = Record<string, never>
> = Omit<React.ComponentPropsWithRef<T>, keyof P> & P;
