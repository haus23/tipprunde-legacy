import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="rounded-lg bg-white shadow">{children}</div>;
}

function Header({ children }: CardProps) {
  return (
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        {children}
      </h3>
    </div>
  );
}

Card.Header = Header;
