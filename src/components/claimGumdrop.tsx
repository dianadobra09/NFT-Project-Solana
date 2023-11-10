import React, {useEffect} from "react";
import queryString from 'query-string';
import {Box, CircularProgress, Link as HyperLink, Stack, Step, StepLabel,} from "@mui/material";
import {useWallet,} from "@solana/wallet-adapter-react";
import {
    Connection as RPCConnection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import {AccountLayout, Token, TOKEN_PROGRAM_ID,} from "@solana/spl-token";
import {sha256} from "js-sha256";
import BN from 'bn.js';
import * as bs58 from "bs58";
import {
    GUMDROP_DISTRIBUTOR_ID,
    GUMDROP_TEMPORAL_SIGNER,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from "../utils/gumdrop/gumdrop-ids";
import {MerkleTree} from "../utils/gumdrop/merkleTree";
import {explorerLinkFor, extractCustomErrorMessage, sendSignedTransaction} from "../utils/gumdrop/transactions";
import {chunk,} from "../utils/gumdrop/claimant";
import {coder} from "../utils/gumdrop/merkleDistributor";
import useUrlParams from '../hooks/useUrlParams';
import * as anchor from '@project-serum/anchor';
import StyledTextField from './styled/StyledTextField';
import {toast} from 'react-hot-toast';
import {COLLECTION_NAME, NOTIFICATION_ONSCREEN_TIME,} from '../utils/constants';
import MintingInfo from './mintingInfo';
import useWindowDimensions from '../hooks/useWindowDimensions';
import WalletNotConnected from './walletNotConnected';
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import StyledStepper from './styled/StyledStepper';

require('@solana/wallet-adapter-react-ui/styles.css');


const walletKeyOrPda = async (
    walletKey: PublicKey,
    handle: string,
    pin: BN | null,
    seed: PublicKey,
): Promise<[PublicKey, Array<Buffer>]> => {
    if (pin === null) {
        try {
            const key = new PublicKey(handle);
            if (!key.equals(walletKey)) {
                throw new Error("Claimant wallet handle does not match connected wallet");
            }
            return [key, []];
        } catch (err) {
            throw new Error(`Invalid claimant wallet handle ${err}`);
        }
    } else {
        const seeds = [
            seed.toBuffer(),
            Buffer.from(handle),
            Buffer.from(pin.toArray("le", 4)),
        ];

        const [claimantPda,] = await PublicKey.findProgramAddress(
            [
                seeds[0],
                ...chunk(seeds[1], 32),
                seeds[2],
            ],
            GUMDROP_DISTRIBUTOR_ID
        );
        return [claimantPda, seeds];
    }
}


const buildMintClaim = async (
    connection: RPCConnection,
    walletKey: PublicKey,
    distributorKey: PublicKey,
    distributorInfo: any,
    tokenAcc: string,
    proof: Array<Buffer>,
    handle: string,
    amount: number,
    index: number,
    pin: BN | null,
): Promise<[Array<TransactionInstruction>, Array<Buffer>, Array<Keypair>]> => {
    let tokenAccKey: PublicKey;
    try {
        tokenAccKey = new PublicKey(tokenAcc);
    } catch (err) {
        throw new Error(`Invalid tokenAcc key ${err}`);
    }
    const distTokenAccount = await connection.getAccountInfo(tokenAccKey);
    if (distTokenAccount === null) {
        throw new Error(`Could not fetch distributor token account`);
    }

    const tokenAccountInfo = AccountLayout.decode(distTokenAccount.data);
    const mint = new PublicKey(tokenAccountInfo.mint);

    const [secret, pdaSeeds] = await walletKeyOrPda(walletKey, handle, pin, mint);

    // TODO: since it's in the PDA do we need it to be in the leaf?
    const leaf = Buffer.from(
        [...new BN(index).toArray("le", 8),
            ...secret.toBuffer(),
            ...mint.toBuffer(),
            ...new BN(amount).toArray("le", 8),
        ]
    );

    const matches = MerkleTree.verifyClaim(
        leaf, proof, Buffer.from(distributorInfo.root)
    );

    if (!matches) {
        throw new Error("Gumdrop merkle proof does not match");
    }

    const [claimStatus, cbump] = await PublicKey.findProgramAddress(
        [
            Buffer.from("ClaimStatus"),
            Buffer.from(new BN(index).toArray("le", 8)),
            distributorKey.toBuffer(),
        ],
        GUMDROP_DISTRIBUTOR_ID
    );

    const [walletTokenKey,] = await PublicKey.findProgramAddress(
        [
            walletKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );

    const setup: Array<TransactionInstruction> = [];

    if (await connection.getAccountInfo(walletTokenKey) === null) {
        setup.push(Token.createAssociatedTokenAccountInstruction(
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            walletTokenKey,
            walletKey,
            walletKey
        ));
    }

    const temporalSigner = distributorInfo.temporal.equals(PublicKey.default) || secret.equals(walletKey)
        ? walletKey : distributorInfo.temporal;

    const claimAirdrop = new TransactionInstruction({
        programId: GUMDROP_DISTRIBUTOR_ID,
        keys: [
            {pubkey: distributorKey, isSigner: false, isWritable: true},
            {pubkey: claimStatus, isSigner: false, isWritable: true},
            {pubkey: tokenAccKey, isSigner: false, isWritable: true},
            {pubkey: walletTokenKey, isSigner: false, isWritable: true},
            {pubkey: temporalSigner, isSigner: true, isWritable: false},
            {pubkey: walletKey, isSigner: true, isWritable: false},  // payer
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
        ],
        data: Buffer.from([
            ...Buffer.from(sha256.digest("global:claim")).slice(0, 8),
            ...new BN(cbump).toArray("le", 1),
            ...new BN(index).toArray("le", 8),
            ...new BN(amount).toArray("le", 8),
            ...secret.toBuffer(),
            ...new BN(proof.length).toArray("le", 4),
            ...Buffer.concat(proof),
        ])
    })

    return [[...setup, claimAirdrop], pdaSeeds, []];
}


const fetchDistributor = async (
    connection: RPCConnection,
    distributorStr: string,
) => {
    let key;
    try {
        key = new PublicKey(distributorStr);
    } catch (err) {
        throw new Error(`Invalid distributor key ${err}`);
    }
    const account = await connection.getAccountInfo(key);
    if (account === null) {
        throw new Error(`Could not fetch distributor ${distributorStr}`);
    }
    if (!account.owner.equals(GUMDROP_DISTRIBUTOR_ID)) {
        const ownerStr = account.owner.toBase58();
        throw new Error(`Invalid distributor owner ${ownerStr}`);
    }
    const info = coder.accounts.decode("MerkleDistributor", account.data);
    return [key, info];
};


const fetchNeedsTemporalSigner = async (
    connection: RPCConnection,
    distributorStr: string,
    indexStr: string,
    claimMethod: string,
) => {
    //in our case claim method is transfer
    const [key, info] = await fetchDistributor(connection, distributorStr);
    if (!info.temporal.equals(GUMDROP_TEMPORAL_SIGNER)) {
        // default pubkey or program itself (distribution through wallets)
        return false;
    } else if (claimMethod === "candy") {
        const [claimCount,] = await PublicKey.findProgramAddress(
            [
                Buffer.from("ClaimCount"),
                Buffer.from(new BN(Number(indexStr)).toArray("le", 8)),
                key.toBuffer(),
            ],
            GUMDROP_DISTRIBUTOR_ID
        );
        // if someone (maybe us) has already claimed this, the contract will
        // not check the existing temporal signer anymore since presumably
        // they have already verified the OTP. So we need to fetch the temporal
        // signer if it is null
        const claimCountAccount = await connection.getAccountInfo(claimCount);
        return claimCountAccount === null;
    } else {
        // default to need one
        return true;
    }
};

export interface ClaimGumdropProps {
    connection: anchor.web3.Connection;
}

export const ClaimGumdrop = (props: ClaimGumdropProps) => {
    let query = useUrlParams();
    const connection = props.connection;
    const wallet = useWallet();

    let queryStr = query.toString();
    if (query) {
        localStorage.setItem("claimQuery", queryStr);
    } else {
        const stored = localStorage.getItem("claimQuery");
        if (stored)
            queryStr = stored;
    }

    const params = queryString.parse(queryStr);
    const [distributor] = React.useState(params.distributor as string || "");
    const [claimMethod, setClaimMethod] = React.useState(
        params.tokenAcc ? "transfer"
            : params.config ? "candy"
                : params.master ? "edition"
                    : "");
    const [tokenAcc] = React.useState(params.tokenAcc as string || "");
    const [candyConfig] = React.useState(params.config as string || "");
    const [candyUUID] = React.useState(params.uuid as string || "");
    const [masterMint] = React.useState(params.master as string || "");
    const [editionStr] = React.useState(params.edition as string || "");
    const [handle, setHandle] = React.useState(params.handle as string || "");
    const [amountStr, setAmount] = React.useState(params.amount as string || "");
    const [indexStr] = React.useState(params.index as string || "");
    const [pinStr] = React.useState(params.pin as string || "");
    const [proofStr] = React.useState(params.proof as string || "");

    const [wasClaimed, setWasClaimed] = React.useState(false);

    const [stateIsLoading, setStateIsLoading] = React.useState(true);

    const {width} = useWindowDimensions();

    let preventSendingOtpEmail = false;
    const discordGuild = params.guild;

    const allFieldsPopulated =
        distributor.length > 0
        && (claimMethod === "transfer" ? tokenAcc.length > 0
                : claimMethod === "candy" ? candyConfig.length > 0 && candyUUID.length > 0
                    : claimMethod === "edition" ? masterMint.length > 0 && editionStr.length > 0
                        : false
        )
        && handle.length > 0
        && amountStr.length > 0
        && indexStr.length > 0;
    // NB: pin can be empty if handle is a public-key and we are claiming through wallets
    // NB: proof can be empty!

    const [editable,] = React.useState(!allFieldsPopulated);
    const [displayError, setDisplayError] = React.useState(false);

    // temporal verification
    const [transaction, setTransaction] = React.useState<Transaction | null>(null);
    const [OTPStr, setOTPStr] = React.useState("");

    // async computed
    const [asyncNeedsTemporalSigner, setNeedsTemporalSigner] = React.useState<boolean>(true);

    React.useEffect(() => {
        const wrap = async () => {
            try {
                setNeedsTemporalSigner(await fetchNeedsTemporalSigner(
                    connection, distributor, indexStr, claimMethod));
            } catch {
                setDisplayError(true);
            }
        };
        wrap();
    }, [connection, distributor, indexStr, claimMethod]);


    useEffect(() => {
        const wrap = async () => {
            const index = Number(indexStr);
            try {
                const [distributorKey,] =
                    await fetchDistributor(connection, distributor);
                const [claimStatus,] = await PublicKey.findProgramAddress(
                    [
                        Buffer.from("ClaimStatus"),
                        Buffer.from(new BN(index).toArray("le", 8)),
                        distributorKey.toBuffer(),
                    ],
                    GUMDROP_DISTRIBUTOR_ID
                );
                const claimStatusAccount = await connection.getAccountInfo(claimStatus);
                if (claimStatusAccount === null) {
                    // nothing claimed yet
                } else {
                    const claimStatusInfo = coder.accounts.decode(
                        "ClaimStatus", claimStatusAccount.data);
                    setWasClaimed(claimStatusInfo.isClaimed);
                }
                setStateIsLoading(false);
            } catch (e) {
                setDisplayError(true);
                setStateIsLoading(false);
            }
        };

        wrap();

        // eslint-disable-next-line
    }, [connection, distributor, indexStr, claimMethod])


    const lambdaAPIEndpoint = `${process.env.REACT_APP_LAMBDA_BASE_URL}/send-OTP`;
    const skipAWSWorkflow = false;

    const sendOTP = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!wallet.connected || wallet.publicKey === null) {
            throw new Error(`Wallet not connected`);
        }

        const index = Number(indexStr);
        const amount = Number(amountStr);
        let pin: BN | null = null;

        if (isNaN(amount)) {
            throw new Error(`Could not parse amount ${amountStr}`);
        }
        if (isNaN(index)) {
            throw new Error(`Could not parse index ${indexStr}`);
        }
        if (params.pin !== "NA") {
            try {
                pin = new BN(pinStr);
            } catch (err) {
                throw new Error(`Could not parse pin ${pinStr}: ${err}`);
            }
        }

        const [distributorKey, distributorInfo] =
            await fetchDistributor(connection, distributor);

        const proof = proofStr === "" ? [] : proofStr.split(",").map(b => {
            const ret = Buffer.from(bs58.decode(b))
            if (ret.length !== 32)
                throw new Error(`Invalid proof hash length`);
            return ret;
        });

        let instructions, pdaSeeds, extraSigners;
        if (claimMethod === "transfer") {
            [instructions, pdaSeeds, extraSigners] = await buildMintClaim(
                connection, wallet.publicKey, distributorKey, distributorInfo,
                tokenAcc,
                proof, handle, amount, index, pin
            );
        } else {
            throw new Error(`Unknown claim method ${claimMethod}`);
        }

        // NB: if we're claiming through wallets then pdaSeeds should be empty
        // since the secret is the wallet key (which is also a signer)
        if (pin === null && pdaSeeds.length > 0) {
            throw new Error(`Internal error: PDA generated when distributing to wallet directly`);
        }

        const transaction = new Transaction({
            feePayer: wallet.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash("singleGossip")).blockhash,
        });

        const signers = new Set<PublicKey>();
        for (const instr of instructions) {
            transaction.add(instr);
            for (const key of instr.keys)
                if (key.isSigner)
                    signers.add(key.pubkey);
        }
        transaction.setSigners(...signers);

        if (extraSigners.length > 0) {
            transaction.partialSign(...extraSigners);
        }

        const txnNeedsTemporalSigner = transaction.signatures.some(s => s.publicKey.equals(GUMDROP_TEMPORAL_SIGNER));

        if (txnNeedsTemporalSigner && !skipAWSWorkflow && !preventSendingOtpEmail) {
            const otpQuery: { [key: string]: any } = {
                method: "send",
                transaction: bs58.encode(transaction.serializeMessage()),
                seeds: pdaSeeds,
            };
            if (discordGuild) {
                otpQuery.discordGuild = discordGuild;
            }
            const params = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(otpQuery),
            };

            const response = await fetch(lambdaAPIEndpoint, params);

            if (response.status !== 200) {
                throw new Error(`Failed to send password`);
            }

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error(`Could not parse password response`);
            }

            let succeeded, toCheck;
            if (discordGuild) {
                succeeded = !!data.id;
                toCheck = "discord";
            } else {
                succeeded = !!data.message;
                toCheck = "email";
            }

            if (!succeeded) {
                throw new Error(`Failed to send password`);
            }

            preventSendingOtpEmail = true;
            toast.success(`Please check your ${toCheck} ${handle} for a password`, {duration: NOTIFICATION_ONSCREEN_TIME})
        }

        return transaction;
    };

    const verifyOTP = async (
        e: React.SyntheticEvent,
        transaction: Transaction | null,
    ) => {
        e.preventDefault();

        if (!transaction) {
            throw new Error(`Transaction not available for OTP verification`);
        }

        if (!wallet.connected || wallet.publicKey === null) {
            throw new Error(`Wallet not connected`);
        }

        let txnNeedsTemporalSigner = transaction.signatures.some(s => s.publicKey.equals(GUMDROP_TEMPORAL_SIGNER));

        if (txnNeedsTemporalSigner && !skipAWSWorkflow) {
            // TODO: distinguish between OTP failure and transactions-error. We can try
            // again on the former but not the latter
            const OTP = Number(OTPStr);
            if (isNaN(OTP) || OTPStr.length === 0) {
                throw new Error(`Could not parse OTP ${OTPStr}`);
            }

            const params = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                FunctionName: "send-OTP",
                body: JSON.stringify({
                    method: "verify",
                    otp: OTP,
                    handle: handle,
                }),
            };

            const response = await fetch(lambdaAPIEndpoint, params);

            if (response.status !== 200) {
                throw new Error(`Failed to verify password. ${JSON.parse(await response.text()).message}`);
            }

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error(`Could not parse OTP verification response`);
            }

            let sig: any;
            try {
                sig = bs58.decode(data);
            } catch {
                throw new Error(`Could not decode transaction signature ${data.body}`);
            }

            transaction.addSignature(GUMDROP_TEMPORAL_SIGNER, sig);
        }

        let fullySignedTransaction: Transaction;
        try {
            // @ts-ignore
            fullySignedTransaction = await wallet.signTransaction(transaction);
        } catch {
            throw new Error("Failed to sign transaction");
        }

        let result: { txid: string; slot: number };

        try {
            result = await sendSignedTransaction({
                connection,
                signedTransaction: fullySignedTransaction,
            });
        } catch (error) {
            let customError = extractCustomErrorMessage(error);
            throw new Error(customError)
        }

        toast(t => (
            <div>
                Congratulations! The airdrop was successful. View <HyperLink target={"_blank"}
                                                                             href={explorerLinkFor(result.txid, connection)}>transaction</HyperLink> on Solscan
            </div>
        ), {duration: NOTIFICATION_ONSCREEN_TIME})

        setTransaction(null);
        setWasClaimed(true)
    };

    const [loading, setLoading] = React.useState(false);
    const loadingProgress = () => (
        <CircularProgress
            size={24}
            sx={{
                position: 'absolute',
                right: '0',
                top: '28%',
                marginTop: '-12px',
                marginLeft: '-12px',
            }}
        />
    );

    const verifyOTPC = (onClick: any) => (
        <React.Fragment>
            <StyledTextField
                id="otp-text-field"
                label="Password"
                value={OTPStr}
                onChange={(e) => setOTPStr(e.target.value)}
            />
            <Box/>
            <div className={"buttons-container flex centered mb-medium"} style={{position: 'relative'}}>
                <button
                    className={"btn wide grey thin mb-small"}
                    onClick={handleBack}
                    style={{marginRight: '20px'}}
                >
                    Back
                </button>
                <button
                    disabled={!wallet.connected || !OTPStr || loading}
                    className={"btn thin dark wide mb-small"}
                    onClick={(e) => {
                        setLoading(true);
                        const wrap = async () => {
                            try {
                                await verifyOTP(e, transaction);
                                setLoading(false);
                                onClick();
                            } catch (err) {
                                toast.error(`${err}`, {duration: NOTIFICATION_ONSCREEN_TIME})
                                setLoading(false);
                                onClick();
                            }
                        };
                        wrap();
                    }}
                >
                    Claim token
                </button>
                {loading && loadingProgress()}
            </div>
        </React.Fragment>
    );

    const populateClaimC = (onClick: any) => (
        <React.Fragment>
            <StyledTextField
                id="claim-method-text-field"
                label="Claim Method"
                value={claimMethod}
                onChange={(e) => setClaimMethod(e.target.value)}
                disabled={!editable}
            />
            {claimMethod !== "edition" && <StyledTextField
                id="amount-text-field"
                label="Amount"
                value={amountStr}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!editable}
            />}
            <StyledTextField
                id="handle-text-field"
                label="Email"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                disabled={!editable}
            />
            <Box/>

            <Box sx={{position: "relative"}}>
                <div className={"buttons-container flex centered mb-medium"} style={{position: 'relative'}}>
                    <div className={"top-wallet-adapter-dropdown-list"}>
                        <WalletMultiButton className={"mb-small"}
                                           style={{marginRight: '20px'}}>change wallet</WalletMultiButton>
                    </div>
                    <button
                        className={"btn wide dark thin mb-small"}
                        disabled={!wallet.connected || !allFieldsPopulated || loading}
                        onClick={(e) => {
                            setLoading(true);
                            const wrap = async () => {
                                try {
                                    const needsTemporalSigner = await fetchNeedsTemporalSigner(
                                        connection, distributor, indexStr, claimMethod);
                                    let transaction: Transaction = await sendOTP(e);
                                    preventSendingOtpEmail = false;
                                    if (!needsTemporalSigner) {
                                        await verifyOTP(e, transaction);
                                    } else {
                                        setTransaction(transaction);
                                    }
                                    setLoading(false);
                                    onClick();
                                } catch (err) {
                                    toast.error(`${err}`, {duration: NOTIFICATION_ONSCREEN_TIME})
                                    setLoading(false);
                                }
                            };

                            wrap();

                        }}
                    >
                        {asyncNeedsTemporalSigner ? "Next" : "Claim token"}
                    </button>
                    {loading && loadingProgress()}
                </div>

            </Box>
        </React.Fragment>
    );

    const steps = [
        {name: "Populate claim", inner: populateClaimC},
    ];
    if (asyncNeedsTemporalSigner) {
        steps.push(
            {name: "Verify password", inner: verifyOTPC}
        );
    }

    // TODO: better interaction between setting `asyncNeedsTemporalSigner` and
    // the stepper... this is pretty jank
    const [activeStep, setActiveStep] = React.useState(0);
    const stepToUse = Math.min(activeStep, steps.length - 1);

    const handleNext = () => {
        // return to start if going past the end (claim succeeded)
        setActiveStep(prev => {
            if (prev === steps.length - 1) {
                return 0;
            } else {
                return prev + 1;
            }
        });
    };
    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const stepper = (
        <React.Fragment>
            <StyledStepper activeStep={stepToUse}>
                {steps.map(s => {
                    return (
                        <Step key={s.name}>
                            <StepLabel>{s.name}</StepLabel>
                        </Step>
                    );
                })}
            </StyledStepper>
            <Box/>
        </React.Fragment>
    );

    return (
        <>
            <div className={"white-container"}>
                <div className={"page-centered-content"}>
                    {!stateIsLoading &&
                    <>{
                        displayError ?
                            <MintingInfo accentText="house of dracula" title="invalid url" centered={true}
                                         message={"Url is either invalid or claiming period has ended. \nPlease try again or contact us on discord or contact@houseofdracula.io"}/> :
                            <>{width <= 768 ?
                                <MintingInfo accentText={COLLECTION_NAME} title={`Claim whitelist \ntokens`}
                                             message={`Claiming from a mobile device is not available \nPlease use a desktop.`}/> :
                                <>{wasClaimed ?
                                    <MintingInfo accentText={COLLECTION_NAME} title={`Success`} centered={true}
                                                 message={`Whitelist token was claimed. Please follow the next steps provided in the email.`}/> :
                                    <>{!wallet.connected || wallet.publicKey === null ?
                                        <WalletNotConnected accentText={"House of Dracula"}
                                                            title={`Claim your \nwhitelist token`}
                                                            message={`Claiming whitelist token \nis now live`}/>

                                        :
                                        <div style={{marginTop: '150px', maxWidth: '700px'}}>
                                            <MintingInfo accentText="house of dracula"
                                                         title="Claim your whitelist token"
                                                         message={`For security reasons we will first send a one time password to your email address to verify that you are the owner.`}/>
                                            <div className={"title small uppercase bold dark"}>connected address
                                            </div>
                                            <div
                                                className={"text-info mb-small"}>{wallet?.publicKey.toString()}</div>
                                            <Stack spacing={2}>
                                                {asyncNeedsTemporalSigner && stepper}
                                                {steps[stepToUse].inner(handleNext)}
                                            </Stack>
                                        </div>
                                    }</>
                                }</>
                            }</>
                    }</>
                    }
                </div>
            </div>
        </>
    );
};

