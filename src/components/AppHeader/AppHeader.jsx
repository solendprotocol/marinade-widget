"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const react_1 = __importStar(require("react"));
const CloseIcon_1 = __importDefault(require("src/icons/CloseIcon"));
const Marinade_1 = __importDefault(require("src/icons/Marinade"));
const MenuIcon_1 = __importDefault(require("src/icons/MenuIcon"));
const HeaderLinks_1 = __importDefault(require("./HeaderLinks"));
const HeaderLinksMobile_1 = __importDefault(require("./HeaderLinksMobile"));
const AppHeader = () => {
    const [openMobileMenu, setOpenMobileMenu] = (0, react_1.useState)(false);
    const handleToggleMenu = () => setOpenMobileMenu(!openMobileMenu);
    (0, react_1.useEffect)(() => {
        const body = document.querySelector('body');
        if (openMobileMenu) {
            body.style.overflow = 'hidden';
        }
        else {
            body.style.overflow = '';
        }
    }, [openMobileMenu]);
    return (<>
      <div className="flex items-center justify-between w-full px-4 py-4 md:px-8">
        <div className="flex items-center flex-1">
          <button onClick={handleToggleMenu} type="button" className="w-6 mr-3 md:hidden text-[#4A5568]">
            {openMobileMenu ? <CloseIcon_1.default /> : <MenuIcon_1.default />}
          </button>

          <link_1.default href="https://jup.ag" shallow className="flex-1">
            <h1 className="flex items-center text-lg font-semibold text-[#4A5568]">
              <Marinade_1.default />
            </h1>
          </link_1.default>
        </div>

        <HeaderLinks_1.default />

        <div className="flex-1"/>
      </div>

      {openMobileMenu && (<div style={{
                height: 'calc(100vh - 70px)',
            }} className="z-50 md:hidden fixed top-[70px] left-0 w-full bg-[rgba(62,62,69,0.85)] backdrop-blur-[20px]" onClick={handleToggleMenu}>
          <HeaderLinksMobile_1.default />
        </div>)}
    </>);
};
exports.default = AppHeader;
