"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const react_1 = __importDefault(require("react"));
const DiscordIcon_1 = __importDefault(require("src/icons/DiscordIcon"));
const RepoLogo_1 = __importDefault(require("src/icons/RepoLogo"));
const SwapIcon_1 = __importDefault(require("src/icons/SwapIcon"));
const HeaderLink = ({ external, href, icon, label }) => {
    return (<link_1.default href={href} shallow className="bg-white/10 flex items-center px-5 py-4 rounded-xl" {...(external
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
        }
        : {})}>
      <span className="flex items-center justify-center h-9 w-9 rounded-full text-[#4A5568]/50 fill-current bg-black/25">
        {icon}
      </span>
      <p className="ml-5 font-medium">{label}</p>
    </link_1.default>);
};
const HeaderLinksMobile = () => {
    return (<div className="px-5 py-4 text-base text-[#4A5568] space-y-2">
      <HeaderLink href="/" label={'Demo'} icon={<SwapIcon_1.default width="20" height="20"/>}/>
      <HeaderLink href="https://github.com/jup-ag/terminal" external label={'Repo'} icon={<RepoLogo_1.default width="20" height="20"/>}/>
      <HeaderLink href="https://discord.gg/jup" external label={'Discord'} icon={<DiscordIcon_1.default width="20" height="20"/>}/>
    </div>);
};
exports.default = HeaderLinksMobile;
