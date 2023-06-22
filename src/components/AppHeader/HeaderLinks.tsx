import Link from 'next/link';
import classNames from 'classnames';
import SwapIcon from 'src/icons/SwapIcon';
import RepoLogo from 'src/icons/RepoLogo';
import DiscordIcon from 'src/icons/DiscordIcon';

const HeaderLink = ({
  href,
  isActive,
  title,
  icon,
  className,
  external = false,
}: {
  href: string;
  isActive: boolean;
  title: string | React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  external?: boolean;
}) => {
  return (
    <Link
      href={href}
      shallow
      className={classNames(
        'flex items-center font-semibold text-[#4A5568]/50 hover:text-[#4A5568] ',
        {
          '!text-[#4A5568] ': isActive,
        },
        className,
      )}
      {...(external
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {})}
    >
      <span className="w-5">{icon}</span>
      <span className="ml-2 whitespace-nowrap">{title}</span>
    </Link>
  );
};

const HeaderLinks = () => {
  return (
    <div className="flex-1 justify-center hidden md:!flex text-sm text-[#4A5568]-35 space-x-10 fill-current">
      <HeaderLink href="/" isActive title={'Demo'} icon={<SwapIcon width="20" height="20" />} />
      <HeaderLink
        href="https://github.com/solendprotocol/marinade-widget"
        isActive={false}
        external
        title={'Repo'}
        icon={<RepoLogo width="20" height="20" />}
      />
      <HeaderLink
        href="https://docs.marinade.finance/"
        isActive={false}
        external
        title={'Docs'}
        icon={<RepoLogo width="20" height="20" />}
      />
      <HeaderLink
        href="https://discord.gg/QU3acbjFem"
        isActive={false}
        external
        title={'Discord'}
        icon={<DiscordIcon width="20" height="20" />}
      />
    </div>
  );
};

export default HeaderLinks;
