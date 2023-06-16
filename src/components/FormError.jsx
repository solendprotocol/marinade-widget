"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const FormError = ({ errors }) => {
    return (<>
      {Object.keys(errors).map((key) => (<div key={key} className="w-full mt-5 bg-[#292A33] border border-black/10 dark:border-white/25 shadow-row-dark py-3 px-5 space-y-1 rounded-lg backdrop-blur-[20px]">
          <div className="flex items-start space-x-2.5">
            <div className="flex-grow">
              <p className="text-[12px] leading-[1.67] font-bold !text-[#F04A44]">{errors[key].title}</p>
              {errors[key].message ? (<p className="text-[12px] leading-[1.17] font-medium dark:text-[#4A5568]/50 text-black/50">
                  {errors[key].message}
                </p>) : null}
            </div>
          </div>
        </div>))}
    </>);
};
exports.default = FormError;
