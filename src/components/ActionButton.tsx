import classNames from 'classnames';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from 'src/contexts/ThemeProvider';

interface IActionButton {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  // ActionButton border gradient, globals.css
  highlighted?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  bgClass?: string;
  rounded?: string;
}

const ActionButton = React.forwardRef(
  (
    { onClick, disabled, children, className = '', size = 'md', type, rounded }: IActionButton,
    ref: React.ForwardedRef<any>,
  ) => {
    const { palette } = useTheme();
    const contentClass = (() => {
      if (size === 'sm') {
        return 'px-4 py-2.5 text-xs';
      }
      if (size === 'md') {
        return 'px-4 py-3 text-sm font-semibold';
      }
      if (size === 'lg') {
        return 'p-5 text-md font-semibold';
      }
    })();
    return (
      <button
        type={type}
        ref={ref}
        className={classNames({
          relative: true,
          'opacity-50 cursor-not-allowed': disabled,
          [className]: true,
          [rounded || 'rounded-lg']: true,
        })}
        style={{
          background: palette.primary,
          color: palette.primaryBg,
        }}
        disabled={disabled}
        onClick={onClick}
      >
        <div className={`${contentClass} h-full w-full leading-none`}>{children}</div>
      </button>
    );
  },
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
