import { Header as _Header } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const headerStyles = tv({ base: '' });

namespace Header {
  export interface Props extends React.HTMLAttributes<HTMLElement> {
    className?: string;
  }
}

export function Header({ className, ...props }: Header.Props) {
  return <_Header className={headerStyles({ className })} {...props} />;
}
