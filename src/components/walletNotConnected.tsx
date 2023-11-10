import {WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import React from 'react';
import MintingInfo from './mintingInfo';

interface WalletNotConnectedProps {
    message: string,
    title: string;
    accentText: string;
}


const WalletNotConnected: React.FC<WalletNotConnectedProps> = (props: WalletNotConnectedProps) => {
    return (
        <div>
            <MintingInfo accentText={props.accentText} title={props.title}
                         message={props.message}/>
            <WalletMultiButton>connect wallet</WalletMultiButton>
        </div>
    );
};

export default WalletNotConnected;