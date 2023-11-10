import {clusterApiUrl, PublicKey} from '@solana/web3.js';

export const CANDY_MACHINE_ID = new PublicKey(
    'cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ',
);

export const GUMDROP_DISTRIBUTOR_ID = new PublicKey(
    'gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a'
);

export const GUMDROP_TEMPORAL_SIGNER = new PublicKey(
    // 'MSv9H2sMceAzccBganUXwGq3GXgqYAstmZAbFDZYbAV'
    '8ZfkPLREaFMSYDuYs1JBKUhQtQmQ4VjdknzmMjwnwLwM'
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);



type Cluster = {
    name: string;
    url: string;
};
export const CLUSTERS: Cluster[] = [
    {
        name: 'mainnet-beta',
        url: 'https://old-thrumming-water.solana-mainnet.quiknode.pro/38603d4c61dd70a07ed16a442397a4c4d2b4e8c0/',
    },
    {
        name: 'testnet',
        url: clusterApiUrl('testnet'),
    },
    {
        name: 'devnet',
        url: clusterApiUrl('devnet'),
    },
];
