import { PublicKey } from '@solana/web3.js';

export const MINIMUM_SOL_BALANCE = 0.05;

// Prices are pulled for these addresses from jup.ag
export const PRICE_MINTS = [
  'So11111111111111111111111111111111111111112',
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
];

export const MAX_INPUT_LIMIT = 100_000_000_000_000;

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

export const MSOL_MINT = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So');
