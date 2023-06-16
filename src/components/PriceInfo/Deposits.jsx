"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Tooltip_1 = __importDefault(require("src/components/Tooltip"));
const utils_1 = require("src/misc/utils");
const Deposits = ({ hasSerumDeposit, hasAtaDeposit, feeInformation, }) => {
    if (hasSerumDeposit || hasAtaDeposit) {
        return (<div className="flex items-start justify-between text-xs">
        <div className="flex w-[50%] text-[#4A5568]/30">
          <span>Deposit</span>
          <Tooltip_1.default variant="dark" className="-mt-24" content={<div className="max-w-xs p-2 rounded-lg text-[#4A5568]-75">
                <ul className="pl-2">
                  {hasSerumDeposit && (<li>
                      <p>
                        <span>Open serum require an OpenOrders account but it can be closed later on.</span>{' '}
                        <a className="underline" target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1qEWc_Bmc1aAxyCUcilKB4ZYpOu3B0BxIbe__dRYmVns">
                          <span>Check here</span>
                        </a>
                        .
                      </p>
                    </li>)}
                  {hasAtaDeposit && (<li>
                      <p>
                        <span>You need to have the token program in order to execute the trade.</span>
                      </p>
                    </li>)}
                </ul>
              </div>}>
            <span className="ml-1 cursor-pointer">[?]</span>
          </Tooltip_1.default>
        </div>
        <div className="w-[50%] text-[#4A5568]/30 text-xs text-right">
          {(() => {
                var _a, _b, _c;
                const content = [
                    hasAtaDeposit && (<p key="ata">
                  <span>
                    {utils_1.formatNumber.format((0, utils_1.fromLamports)(feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.ataDeposits.reduce((s, deposit) => {
                            s += deposit;
                            return s;
                        }, 0), 9))}{' '}
                    SOL for {(_a = feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.ataDeposits) === null || _a === void 0 ? void 0 : _a.length}{' '}
                    {(((_b = feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.ataDeposits) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0 ? 'ATA account' : 'ATA accounts'}
                  </span>
                </p>),
                    hasSerumDeposit && (<p key="serum">
                  <span>
                    {utils_1.formatNumber.format((0, utils_1.fromLamports)(feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.openOrdersDeposits.reduce((s, deposit) => {
                            s += deposit;
                            return s;
                        }, 0), 9))}{' '}
                    SOL for {feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.openOrdersDeposits.length}{' '}
                    {(((_c = feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.openOrdersDeposits) === null || _c === void 0 ? void 0 : _c.length) || 0) > 0
                            ? 'Serum OpenOrders account'
                            : 'Serum OpenOrders accounts'}
                  </span>
                </p>),
                ].filter(Boolean);
                if (content.length) {
                    return content;
                }
                return '-';
            })()}
        </div>
      </div>);
    }
    return null;
};
exports.default = Deposits;
