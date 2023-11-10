
export const CANDY_MACHINE_ID = "DujuuZRTCq2LAbTEhZbpXS1Y8279dQytATDkKKUAwTt4"

export const SOLANA_NETWORK = "mainnet-beta"
export const SOLANA_RPC_HOST = "https://old-thrumming-water.solana-mainnet.quiknode.pro/38603d4c61dd70a07ed16a442397a4c4d2b4e8c0/"

export const COLLECTION_NAME = 'House of Dracula';
export const GENERIC_ERROR_MESSAGE = "Oops, something went wrong";
export const TRANSACTION_FEES = 0.01198 //gas fee + creation of accounts to hold the nft

export const MAX_MINT = 5;

export const NOTIFICATION_ONSCREEN_TIME = 10000;

export const getMintCountOptions = (maxMintCount: number): number[] => Array.from(Array(maxMintCount), (_, i) => i + 1);
