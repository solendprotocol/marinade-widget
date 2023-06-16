"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const classnames_1 = __importDefault(require("classnames"));
const SwapIcon_1 = __importDefault(require("src/icons/SwapIcon"));
const RepoLogo_1 = __importDefault(require("src/icons/RepoLogo"));
const DiscordIcon_1 = __importDefault(require("src/icons/DiscordIcon"));
const HeaderLink = ({ href, isActive, title, icon, className, external = false, }) => {
    return (<link_1.default href={href} shallow className={(0, classnames_1.default)('flex items-center font-semibold text-[#4A5568]/50 hover:text-[#4A5568] ', {
            '!text-[#4A5568] ': isActive,
        }, className)} {...(external
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
        }
        : {})}>
      <span className="w-5">{icon}</span>
      <span className="ml-2 whitespace-nowrap">{title}</span>
    </link_1.default>);
};
const HeaderLinks = () => {
    return (<div className="flex-1 justify-center hidden md:!flex text-sm text-[#4A5568]-35 space-x-10 fill-current">
      <HeaderLink href="/" isActive title={'Demo'} icon={<SwapIcon_1.default width="20" height="20"/>}/>
      <HeaderLink href="https://github.com/jup-ag/terminal" isActive={false} external title={'Repo'} icon={<RepoLogo_1.default width="20" height="20"/>}/>
      <HeaderLink href="https://station.jup.ag/docs/web-integration/jupiter-terminal" isActive={false} external title={'Docs'} icon={<RepoLogo_1.default width="20" height="20"/>}/>
      <HeaderLink href="https://discord.gg/jup" isActive={false} external title={'Discord'} icon={<DiscordIcon_1.default width="20" height="20"/>}/>
    </div>);
};
exports.default = HeaderLinks;
