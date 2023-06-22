import { ReactNode } from 'react';

const BigText = ({ children, className }: { children: ReactNode; className?: string }) => {
  const baseClass = 'bg-clip-text';
  const classes = [baseClass, className].join(' ');
  return (
    <span className={classes} style={{}}>
      {children}
    </span>
  );
};

export default BigText;
