import classNames from 'classnames';
import { useTheme } from 'src/contexts/ThemeProvider';

type Props = {
  active: boolean;
  onClick: (active: boolean) => void;
  className?: string;
  dotClassName?: string;
};

const Toggle = ({ active, onClick, className, dotClassName }: Props) => {
  const { palette } = useTheme();
  const activeClass = 'bg-white transform translate-x-full';
  const inactiveClass = 'bg-white';
  return (
    <button
      type="button"
      className={classNames('w-10 h-[22px] flex items-center rounded-full p-[1px] cursor-pointer', className)}
      onClick={() => onClick(!active)}
      style={{
        background: active ? palette.primary : palette.disabledText,
      }}
    >
      <div
        className={classNames(
          `w-[18px] h-[18px] rounded-full shadow-md transform duration-300 ease-in-out`,
          active ? activeClass : inactiveClass,
          dotClassName,
        )}
      ></div>
    </button>
  );
};

export default Toggle;
