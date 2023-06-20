import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { BN, Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk';
import { solToLamports, STAKE_PROGRAM_ID } from '@marinade.finance/marinade-ts-sdk/dist/src/util';
import { useWalletPassThrough } from './WalletPassthroughProvider';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useSwapContext } from './SwapContext';
import { IInit, PaletteType } from 'src/types';
import { formatAddress } from 'src/components/ValidatorRow';
import { useScreenState } from './ScreenProvider';
import { useMediaQuery } from "react-responsive";
import { INITIAL_FORM_CONFIG } from 'src/constants';

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

type AppPaletteType = {
    primary: string,
    secondary: string,
    primaryBg: string,
    secondaryBg: string,
    text: string,
    disabledText: string,
}

type StakeModeType = 'liquid' | 'native';

type DataType = {
    validators: Array<ValidatorType>;
    stakeMode: StakeModeType;
    stakeAccounts: Array<StakeAccountType>;
    delegationStrategy: ValidatorType | null;
    target: TargetType | null;
    marinadeStats: MarinadeStatsType | null;
    palette: AppPaletteType;
    colors: PaletteType;
    deposit: () => Promise<string | undefined>;
    refresh: () => void;
    setStakeMode: (mode: StakeModeType ) => void;
    setTarget: (mode: TargetType | null ) => void;
    allowDirectStake: boolean;
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
    allowDirectStake: true,
    palette: {
        primary: INITIAL_FORM_CONFIG.palette.primaryLight,
        secondary: INITIAL_FORM_CONFIG.palette.secondaryLight,
        primaryBg: INITIAL_FORM_CONFIG.palette.primaryBgLight,
        secondaryBg: INITIAL_FORM_CONFIG.palette.secondaryBgLight,
        text: INITIAL_FORM_CONFIG.palette.textLight,
        disabledText: INITIAL_FORM_CONFIG.palette.disabledTextLight,
    },
    colors: INITIAL_FORM_CONFIG.palette,
    deposit: () => Promise.resolve(''),
    refresh: () => undefined,
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

type StakeAccountStatusType = 'active' | 'inactive' | 'minBalance';

export type StakeAccountType = {
    balance: string;
    address: string;
    status: StakeAccountStatusType;
    background: string;
    waitEpoch: number;
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

export const DataProvider: FC<IInit & { children: ReactNode }> = ({ formProps, children, palette }) => {
  const [validators, setValidators] = useState<DataType['validators']>(defaultContextValues.validators);
  const [stakeMode, setStakeMode] = useState<StakeModeType>(defaultContextValues.stakeMode);
  const [target, setTarget] = useState<TargetType | null>(defaultContextValues.target);
  const [marinadeStats, setMarinadeStats] = useState<MarinadeStatsType | null>(null);
  const { publicKey, wallet } = useWalletPassThrough();
  const { connection } = useConnection();
  const { setScreen, setContext } = useScreenState();
  const [ stakeAccounts, setStakeAccounts] = useState<Array<StakeAccountType>>([])
  const allowDirectStake = Boolean(formProps?.allowDirectStake);
  const [directedValidatorAddress, setDirectedValidatorAddress] = useState<string | null>(allowDirectStake ? (formProps?.initialValidator ?? defaultContextValues.delegationStrategy) : null);
  const delegationStrategy = validators.find(v => v.address === directedValidatorAddress) ?? null;

  const systemPrefersDark = useMediaQuery(
    {
      query: "(prefers-color-scheme: dark)"
    },
  );

  function setDelegationStrategy(validator: ValidatorType | null) {
    setDirectedValidatorAddress(validator?.address ?? null);
  }

  useEffect(() => {
    setDirectedValidatorAddress(formProps?.initialValidator ?? null);
  }, [formProps?.initialValidator])
  
  const marinadeConfig = useMemo(() => {
    const defaultConfig = new MarinadeConfig({
        connection,
        publicKey,
    });
    try {
        if (!formProps?.referralCode) return defaultConfig;
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
            
            const { transaction } = target.type === 'native' ? await marinade.deposit(
                bnAmount,
                {
                    directToValidatorVoteAddress: delegationStrategy ? new PublicKey(delegationStrategy.voteAddress) : undefined
                }
            ) : await marinade.depositStakeAccount(
              new PublicKey(target.stakeAccount.address),
              {
                directToValidatorVoteAddress: delegationStrategy ? new PublicKey(delegationStrategy.voteAddress) : undefined
              },
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
              let status = 'active' as StakeAccountStatusType;
              const balance = s.account.lamports / LAMPORTS_PER_SOL;
    
              if (earliestDepositEpoch > currentEpoch) {
                status = 'inactive' as StakeAccountStatusType;
              }
              if (balance < 1) {
                status = 'minBalance' as StakeAccountStatusType;
              }
    
              return {
                balance: balance.toString(),
                address: s.pubkey.toString(),
                background: `linear-gradient(to top,${getRandomHEXColor(s.pubkey.toString())}, ${getRandomHEXColor(s.pubkey.toString().slice(7, 17))})`,
                status,
                waitEpoch: Math.max(0, earliestDepositEpoch - currentEpoch),
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

    function refresh() {
        fetchValidators();
        fetchMarinadeStats();
        fetchStakeAccounts();
    }

  return <DataContext.Provider value={{ 
        allowDirectStake,
        validators, 
        stakeMode,
        setStakeMode,
        stakeAccounts,
        deposit,
        delegationStrategy,
        palette: {       
            primary: systemPrefersDark ? palette.primaryDark : palette.primaryLight,
            secondary: systemPrefersDark ? palette.secondaryDark : palette.secondaryLight,
            primaryBg: systemPrefersDark ? palette.primaryBgDark : palette.primaryBgLight,
            secondaryBg: systemPrefersDark ? palette.secondaryBgDark : palette.secondaryBgLight,
            text: systemPrefersDark ? palette.textDark : palette.textLight,
            disabledText: systemPrefersDark ? palette.disabledTextDark : palette.disabledTextLight,
        },
        // full pallete
        colors: palette,
        refresh,
        setDelegationStrategy,
        target,
        marinadeStats,
        setTarget,
        setTargetAmount,
    }}>{children}</DataContext.Provider>;
};
