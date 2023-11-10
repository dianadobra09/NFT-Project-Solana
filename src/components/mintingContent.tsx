import React, {useEffect, useState} from "react";
import Countdown from "react-countdown";
import * as anchor from "@project-serum/anchor";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {CandyMachine, getCandyMachineState, mintMultipleToken, getWhitelistSPLTokensCount} from "../utils/candy-machine";
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import {toast} from 'react-hot-toast';
import {CircularProgress} from '@material-ui/core';
import ProgressiveImage from 'react-progressive-graceful-image';
import bgImg from '../assets/minting-bg.png';
import bgImgThmb from '../assets/minting-bg-thmb.png';
import mainImage from '../assets/minting-img.png';
import mainImageThmb from '../assets/minting-img-thmb.png';
import {
    COLLECTION_NAME,
    GENERIC_ERROR_MESSAGE,
    getMintCountOptions,
    MAX_MINT,
    NOTIFICATION_ONSCREEN_TIME,
    TRANSACTION_FEES
} from '../utils/constants';
import useWindowDimensions from '../hooks/useWindowDimensions';
import MintingInfo from './mintingInfo';
import MintingSoldOut from './mintingSoldOut';
import WalletNotConnected from './walletNotConnected';

require('@solana/wallet-adapter-react-ui/styles.css');

export interface MintingContentProps {
    candyMachineId: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
}

const mintCountOptions: number[] = getMintCountOptions(MAX_MINT);


const MintingContent = (props: MintingContentProps) => {
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
    const [mintCount, setMintCount] = useState(mintCountOptions[MAX_MINT - 1]); // nr of NFTs to mint at a time
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();

    const [isWhitelist, setIsWhitelist] = useState(false);
    const [, setCountdownComplete] = useState(false);

    const {width} = useWindowDimensions();

    const wallet = useAnchorWallet(); //buyer wallet

    const refreshCandyMachineState = () => {
        (async () => {
            if (!wallet) return;
            const candyMachine = await getCandyMachineState(
                wallet as anchor.Wallet,
                props.candyMachineId,
                props.connection
            );
            let whitelistTokensCount = 0;
            if (candyMachine.state.whitelistMintSettings) {
                whitelistTokensCount = await getWhitelistSPLTokensCount(
                    props.connection,
                    wallet.publicKey,
                    candyMachine.state.whitelistMintSettings?.mint
                );
            }
            setIsWhitelist(candyMachine.state.whitelistMintSettings != null && whitelistTokensCount > 0)
            setCandyMachine(candyMachine);
        })();
    };

    const startMintMultiple = async (quantity: number) => {

        try {
            setIsMinting(true);
            if (candyMachine?.program && wallet) {

                if (mintCount > candyMachine.state.itemsRemaining) {
                    toast.error(`There are only ${candyMachine.state.itemsRemaining} mints available.`, {duration: NOTIFICATION_ONSCREEN_TIME});
                    return;
                }

                const oldBalance = (await props.connection.getBalance(wallet?.publicKey)) / LAMPORTS_PER_SOL;
                const approximatePrice = mintCount * (candyMachine.state.price + TRANSACTION_FEES);
                if (oldBalance < approximatePrice) {
                    toast.error(`Insufficient funds. Please fund your wallet.`, {duration: NOTIFICATION_ONSCREEN_TIME});
                    return;
                }

                try {
                    const successfulTransactions: string[] = await mintMultipleToken(
                        candyMachine,
                        wallet.publicKey,
                        candyMachine.state.treasury,
                        quantity
                    );

                    if (successfulTransactions.length === mintCount) {
                        toast.success(`Congratulations! ${mintCount} mints succeeded! Your NFTs should appear in your wallet soon`, {duration: NOTIFICATION_ONSCREEN_TIME});
                    } else {
                        toast.error(`Some mints failed! ${mintCount - successfulTransactions.length} mints failed! Check your wallet`, {duration: NOTIFICATION_ONSCREEN_TIME});
                    }
                } catch (e: any) {
                    toast.error(e.message, {duration: NOTIFICATION_ONSCREEN_TIME});
                }

            }
        } catch (e) {
            toast.error(GENERIC_ERROR_MESSAGE, {duration: NOTIFICATION_ONSCREEN_TIME});
        } finally {
            setIsMinting(false);
        }
    };

    useEffect(() => {
        refreshCandyMachineState();
        let id = props.connection.onAccountChange(props.candyMachineId, (res) => refreshCandyMachineState());
        return () => {
            props.connection.removeAccountChangeListener(id);
            return;
        }
        // eslint-disable-next-line
    }, [wallet, props.candyMachineId, props.connection]);


    const Mint = () => {

        return (
            <>
                <div className={"text-accent"}>{isWhitelist ? "whitelist" : COLLECTION_NAME}</div>
                <div className={"title medium uppercase bold dark"}>connected address</div>
                <div className={"text-info shrink mb-small"}
                     style={{fontSize: '16px'}}>{wallet?.publicKey.toString()}</div>
                <div className={"title medium uppercase bold dark"}>{isWhitelist ? "whitelist " : ""}mint price</div>
                <div className={"text-info mb-small"}>{candyMachine?.state.price} SOL per NFT + fees</div>
                <select className={"mb-small"} value={mintCount}
                        onChange={(e) => setMintCount(parseInt(e.target.value))}>
                    {mintCountOptions.map((n) => (
                        <option key={n} value={n} style={{height: '45px'}} className={"dropdown-option"}>{n}</option>)
                    )}
                </select>
                <div className={"buttons-container"}>
                    <button id="mint-btn" className={"btn wide thin dark mb-small"}
                            onClick={() => startMintMultiple(mintCount)}
                            disabled={candyMachine?.state.isSoldOut || isMinting || (!isWhitelist && !candyMachine?.state.isActive)}>
                        mint now!
                    </button>
                    <WalletMultiButton className={"mb-small"}>change wallet</WalletMultiButton>
                </div>
                <div className={"text-basic dark"}>Max {MAX_MINT} NFTs per transaction</div>
                <div className={"text-basic dark flex space-between mb-small"}>
                    <span>Phase 1 remaining: { candyMachine ? 3500 - candyMachine?.state.itemsRedeemed : ''}</span>
                    <span>Total minted: {candyMachine?.state.itemsRedeemed}</span>
                </div>
                {isMinting && <div className={"loading-spinner"}><CircularProgress size={50}/></div>}
            </>
        );
    };

    const CountDown = () => {
        return (
            <>
                <div className={"text-accent"}>{COLLECTION_NAME}</div>
                <div className={"title medium uppercase bold mb-small dark"}>minting will {'\n'}be live in:</div>
                <Countdown
                    date={candyMachine?.state.goLiveDate}
                    onMount={({completed}) => completed && setCountdownComplete(true)}
                    onComplete={() => setCountdownComplete(true)}
                    renderer={({days, hours, minutes, seconds, completed}) =>
                        <span className={"flex mb-small"}>
                            <span className={"flex column"} style={{marginRight: '30px'}}>
                                <span className={"title medium uppercase bold flex dark"}>{days}</span>
                                <span className={"text-info small"}>DAYS</span>
                            </span>
                            <span className={"flex column"} style={{marginRight: '30px'}}>
                                <span className={"title medium uppercase bold flex dark"}>{hours}</span>
                                <span className={"text-info small"}>HOURS</span>
                            </span>
                            <span className={"flex column"} style={{marginRight: '30px'}}>
                                <span className={"title medium uppercase bold flex dark"}>{minutes}</span>
                                <span className={"text-info small"}>MINUTES</span>
                            </span>
                            <span className={"flex column"} style={{marginRight: '30px'}}>
                                <span className={"title medium uppercase bold flex dark"}>{seconds}</span>
                                <span className={"text-info small"}>SECONDS</span>
                            </span>
                        </span>
                    }
                />
                <WalletMultiButton className={"mb-small"}>change wallet</WalletMultiButton>
            </>
        );
    };

    return (
        <div id="home" className={"minting-page-container"}>
            <div className={"full-background-image"}>
                <ProgressiveImage src={bgImg} placeholder={bgImgThmb}>
                    {(src: any, loading: boolean) => (
                        <img style={{
                            opacity: loading ? 0.5 : 1,
                            transition: 'opacity 2s ease-in-out',
                            width: '100vw',
                            height: 'auto'
                        }}
                             src={src}
                             alt="house of dracula"/>
                    )}
                </ProgressiveImage>
            </div>
            <div className={"minting-left-container"}>
                <div className={"flex centered"}>
                    <ProgressiveImage src={mainImage} placeholder={mainImageThmb}>
                        {(src: any, loading: boolean) => (
                            <img style={{opacity: loading ? 0.5 : 1, transition: 'opacity 2s ease-in-out'}}
                                 src={src}
                                 alt="house of dracula" className="main-image"/>
                        )}
                    </ProgressiveImage>
                </div>
            </div>
            <div className={"minting-right-container"}>
                <div className={"minting-content-container"}>
                    {
                        width <= 768 ? <MintingInfo accentText={COLLECTION_NAME} title={`mint your \nown dracula`}
                                                    message={`Minting from a mobile device is not available \nPlease use a desktop.`}/> :
                            <>
                                {wallet && candyMachine ?
                                    <>
                                        { candyMachine.state.endSettings?.number && candyMachine.state.endSettings?.number?.toNumber() <= candyMachine.state.itemsRedeemed
                                            ?
                                            <MintingSoldOut/>
                                            :
                                            <>
                                                {candyMachine.state.isActive || isWhitelist
                                                    ?
                                                    <>{candyMachine.state.isSoldOut ? <MintingSoldOut/> : <Mint/>}</>
                                                    :
                                                    <CountDown/>
                                                }
                                            </>
                                        }
                                    </>
                                    :
                                    <WalletNotConnected accentText={COLLECTION_NAME} title={`Mint your own \ndracula`}
                                                        message={`Minting for ${COLLECTION_NAME} \nis live`}/>
                                }
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default MintingContent;
