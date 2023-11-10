import React, {useMemo} from "react";

import {ClaimGumdrop} from '../components/claimGumdrop';
import {clusterApiUrl} from '@solana/web3.js';
import {
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet
} from '@solana/wallet-adapter-wallets';
import {SOLANA_NETWORK, SOLANA_RPC_HOST} from '../utils/constants';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import * as anchor from '@project-serum/anchor';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';

const network = SOLANA_NETWORK as WalletAdapterNetwork;
const connection = new anchor.web3.Connection(SOLANA_RPC_HOST);

const Gumdrop = () => {
    const endpoint = useMemo(() => clusterApiUrl(network), []);

    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSlopeWallet(),
            getSolflareWallet(),
            getSolletWallet({network}),
            getSolletExtensionWallet({network})
        ],
        []
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <ClaimGumdrop connection={connection}/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>)

};

export default Gumdrop;
