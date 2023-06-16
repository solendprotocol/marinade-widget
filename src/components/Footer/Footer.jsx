"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const DiscordIcon_1 = __importDefault(require("src/icons/DiscordIcon"));
const TwitterIcon_1 = __importDefault(require("src/icons/TwitterIcon"));
const Footer = () => {
    return (<footer className="flex text-center justify-center items-center p-2.5 text-xs text-[#4A5568] space-x-2">
      <link_1.default href="https://twitter.com/jupiterexchange" target="_blank">
        <TwitterIcon_1.default />
      </link_1.default>

      <link_1.default href="https://discord.gg/jup" target="_blank">
        <DiscordIcon_1.default />
      </link_1.default>
    </footer>);
};
exports.default = Footer;
