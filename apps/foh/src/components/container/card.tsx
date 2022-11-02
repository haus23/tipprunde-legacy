import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="w-full mx-auto max-w-3xl p-6 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
      {children}
    </div>
  );
}
