import { ReactNode } from 'react';

const SexyChameleonText = ({ children, className }: { children: ReactNode; className?: string }) => {
  const baseClass =
    'text-white bg-clip-text';
  const classes = [baseClass, className].join(' ');
  return <span className={classes}>{children}</span>;
};

export default SexyChameleonText;
