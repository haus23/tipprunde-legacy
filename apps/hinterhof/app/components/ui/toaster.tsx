import { Toaster as ToasterPrimitive, type ToasterProps } from 'sonner';

namespace Toaster {
  export interface Props extends ToasterProps {}
}

export function Toaster({ ...props }: Toaster.Props) {
  return <ToasterPrimitive {...props} />;
}
