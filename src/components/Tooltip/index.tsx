import classNames from 'classnames';
import * as React from 'react';

interface TooltipProps {
  className?: string;
  content: string | React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'dark' | 'light';
}

const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = ({
  className,
  content,
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div
        className={classNames(
          'invisible absolute rounded shadow-lg p-2 bottom-20 right-0 w-full -mt-8 bg-[#C8ECE1]',
          className,
          {
            'group-hover:visible group-hover:z-50': !disabled,
          },
        )}
      >
        {content}
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
