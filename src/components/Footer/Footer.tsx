import Link from 'next/link';
import DiscordIcon from 'src/icons/DiscordIcon';
import TwitterIcon from 'src/icons/TwitterIcon';

const Footer = () => {
  return (
    <footer className="flex text-center justify-center items-center p-2.5 text-xs text-[#4A5568] space-x-2">
      <Link href="https://twitter.com/MarinadeFinance" target="_blank">
        <TwitterIcon />
      </Link>

      <Link href="https://discord.gg/QU3acbjFem" target="_blank">
        <DiscordIcon />
      </Link>
    </footer>
  );
};

export default Footer;
