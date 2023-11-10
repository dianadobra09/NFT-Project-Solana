import {useMemo} from "react";
import * as anchor from "@project-serum/anchor";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {ConnectionProvider, WalletProvider,} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';
import MintingContent from '../components/mintingContent';
import {
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import {
    CANDY_MACHINE_ID,
    SOLANA_NETWORK,
    SOLANA_RPC_HOST
} from '../utils/constants';

const candyMachineId = new anchor.web3.PublicKey(
    CANDY_MACHINE_ID
);

const network = SOLANA_NETWORK as WalletAdapterNetwork;
const connection = new anchor.web3.Connection(SOLANA_RPC_HOST);


const Minting = () => {
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
                    <MintingContent
                        candyMachineId={candyMachineId}
                        connection={connection}
                    />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Minting;

