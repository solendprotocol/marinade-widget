import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { BN, Marinade, MarinadeConfig, MarinadeState } from '@marinade.finance/marinade-ts-sdk';
import { solToLamports, STAKE_PROGRAM_ID } from '@marinade.finance/marinade-ts-sdk/dist/src/util';
import { useWalletPassThrough } from './WalletPassthroughProvider';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useSwapContext } from './SwapContext';
import { IInit } from 'src/types';
import { formatAddress } from 'src/components/ValidatorRow';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { useScreenState } from './ScreenProvider';

type ValidatorsResponseType = {
    validators: Array<{
        identity: string;
        info_name: string;
        vote_account: string;
        info_keybase: string;
        score: number;
    }>;
}

export type ValidatorType = {
    name: string;
    address: string;
    voteAddress: string;
    logo: string;
    score: number;
}

type StakeModeType = 'liquid' | 'native';

type DataType = {
    validators: Array<ValidatorType>;
    stakeMode: StakeModeType;
    stakeAccounts: Array<StakeAccountType>;
    delegationStrategy: ValidatorType | null;
    target: TargetType | null;
    marinadeStats: MarinadeStatsType | null;
    deposit: () => Promise<string | undefined>;
    setStakeMode: (mode: StakeModeType ) => void;
    setTarget: (mode: TargetType | null ) => void;
    setTargetAmount: (amount: number) => void;
    setDelegationStrategy: (validator: ValidatorType | null) => void;
}

const defaultContextValues ={
    validators: [],
    stakeMode: 'liquid' as StakeModeType,
    stakeAccounts: [],
    target: null,
    delegationStrategy: null,
    marinadeStats: null,
    deposit: () => Promise.resolve(''),
    setTarget: () => undefined,
    setStakeMode: () => undefined,
    setTargetAmount: () => undefined,
    setDelegationStrategy: () => undefined,
}

const VALIDATORS_API = 'https://validators-api.marinade.finance/validators?limit=9999&epochs=0';
const MSOLSOLPRICE_API = 'https://api.marinade.finance/msol/price_sol';

export const DataContext = createContext<DataType>(defaultContextValues);

export function useData(): DataType {
  return useContext(DataContext);
}

const WALLET_OFFSET = 44;
const DATA_SIZE = 200;

export type StakeAccountType = {
    balance: string;
    address: string;
    status: string;
    background: string;
};

export type TargetType = {
    type: 'stakeAccount',
    stakeAccount: StakeAccountType,
    amount: number,
} | {
    type: 'native',
    amount: number,
}

type MarinadeStatsType = {
    msolSolPrice: number,
    stakingRewardFee: number,
    rewardDepositFee: number,
    rewardDepositStakeFee: number,
}


function getRandomHEXColor(seed: string) {
    let output = '#';
    const chars = '0123456789abcdef'
    while (output.length < 7) {
      output += chars[seed[output.length].charCodeAt(0) % chars.length];
    }
    return output;
  }

export const DataProvider: FC<IInit & { children: ReactNode }> = ({ formProps, children }) => {
  const [validators, setValidators] = useState<DataType['validators']>(defaultContextValues.validators);
  const [stakeMode, setStakeMode] = useState<StakeModeType>(defaultContextValues.stakeMode);
  const [target, setTarget] = useState<TargetType | null>(defaultContextValues.target);
  const [marinadeStats, setMarinadeStats] = useState<MarinadeStatsType | null>(null);
  const { publicKey, wallet } = useWalletPassThrough();
  const { connection } = useConnection();
  const { setScreen, setContext } = useScreenState();
  const [ stakeAccounts, setStakeAccounts] = useState<Array<StakeAccountType>>([])
  const [delegationStrategy, setDelegationStrategy] = useState<ValidatorType | null>(defaultContextValues.delegationStrategy);

  const marinadeConfig = useMemo(() => {
const defaultConfig = new MarinadeConfig({
    connection,
    publicKey,
});
    try {
        if (!formProps?.referralCode) return defaultConfig;
        console.log('never')
            return new MarinadeConfig({
                referralCode: new PublicKey(
                    formProps.referralCode,
                    ),
                connection,
                publicKey,
            });
    } catch (e) {
        console.error('Invalid referral code');
        return defaultConfig;
    }

    }, [formProps?.referralCode, publicKey])

    async function fetchValidators() {
        const response = (await axios.get(
            VALIDATORS_API
        )).data as ValidatorsResponseType;

        setValidators(response.validators.map(v => ({
            address: v.identity,
            name: v.info_name ?? formatAddress(v.identity),
            voteAddress: v.vote_account,
            score: v.score,
            logo: `https://keybase.io/${v.info_keybase}/picture?format=square_360`,
        })));
    };

    async function fetchMarinadeStats() {
        const marinade = new Marinade(marinadeConfig);
        const response = (await axios.get(
            MSOLSOLPRICE_API
        )).data as number;
        const state = await marinade.getMarinadeState();
        console.log(marinadeConfig.referralCode);
        const partnerState = marinadeConfig.referralCode ?  await marinade.getReferralPartnerState() : null;

        setMarinadeStats({
            msolSolPrice: response,
            stakingRewardFee: state.rewardsCommissionPercent,
            rewardDepositFee: partnerState?.state.operationDepositSolFee ?? 0,
            rewardDepositStakeFee: partnerState?.state.operationDepositStakeAccountFee ?? 0,
        });
    }

    function setTargetAmount(amount: number) {
        setTarget(target ? {
            ...target,
            amount,
        } : null)
    }

    async function deposit() {
        if (!wallet || !target) return;

        try {
            const marinade = new Marinade(marinadeConfig);
    
            const bnAmount = new BN(solToLamports(target.amount));
            
            const { transaction } = await marinade.deposit(
                bnAmount,
                {
                    directToValidatorVoteAddress: delegationStrategy ? new PublicKey(delegationStrategy.voteAddress) : undefined
                }
            );
    
            setScreen('Signing')
            const signature = await wallet.adapter.sendTransaction(transaction, connection);
            const latestBlockhash = await connection.getLatestBlockhash();
            setScreen('Confirming')
            await connection.confirmTransaction({
                signature,
                ...latestBlockhash
            }, 'confirmed');
    
            setScreen('Success')
            setContext({
                message: signature,
                callback: () => {
                    setScreen('Initial');
                    setTargetAmount(0);
                }
            })
            return signature;
        } catch (e: any) {
            setScreen('Error')
            setContext({
                message: String(e.message ?? e),
                callback: () => {
                    setScreen('Initial');
                }
            })
        }
    }

    async function fetchStakeAccounts() {
        if (!publicKey) return;
        const stakeAccounts = await connection.getParsedProgramAccounts(
          STAKE_PROGRAM_ID,
          {
            filters: [
              {
                dataSize: DATA_SIZE, // number of bytes
              },
              {
                memcmp: {
                  offset: WALLET_OFFSET, // number of bytes
                  bytes: publicKey.toString(), // base58 encoded string
                },
              },
            ],
          },
        );
    
        const currentEpoch = await (await connection.getEpochInfo()).epoch;

        setStakeAccounts(
          stakeAccounts
            .map((s) => {
              const activationEpoch =
                (s?.account?.data as any)?.parsed?.info?.stake?.delegation
                  ?.activationEpoch ?? null;
    
              const waitEpochs = 2;
              const earliestDepositEpoch = Number(activationEpoch) + waitEpochs;
              let status = 'active';
              const balance = s.account.lamports / LAMPORTS_PER_SOL;
    
              if (earliestDepositEpoch > currentEpoch) {
                status = 'inactive';
              }
              if (balance < 1) {
                status = 'minBalance';
              }
    
              return {
                balance: balance.toString(),
                address: s.pubkey.toString(),
                background: `linear-gradient(to top,${getRandomHEXColor(s.pubkey.toString())}, ${getRandomHEXColor(s.pubkey.toString().slice(7, 17))})`,
                status,
                data: s.account,
              };
            })
            .sort((s) => (s.status === 'active' ? -1 : 1)),
        );
      }

    useEffect(() => {
        fetchValidators();
        fetchMarinadeStats();
    }, [formProps]);

    useEffect(() => {
        fetchStakeAccounts();
    }, [publicKey]);

  return <DataContext.Provider value={{ 
        validators, 
        stakeMode,
        setStakeMode,
        stakeAccounts,
        deposit,
        delegationStrategy,
        setDelegationStrategy,
        target,
        marinadeStats,
        setTarget,
        setTargetAmount,
    }}>{children}</DataContext.Provider>;
};
