import * as anchor from "@project-serum/anchor";

import {MintLayout, Token, TOKEN_PROGRAM_ID,} from "@solana/spl-token";
import {
    Blockhash,
    Commitment,
    Connection,
    FeeCalculator,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    RpcResponseAndContext,
    SignatureStatus,
    SimulatedTransactionResponse,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    TransactionSignature
} from '@solana/web3.js';
import {WalletNotConnectedError} from '@solana/wallet-adapter-base';
import {GENERIC_ERROR_MESSAGE} from './constants';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const CANDY_MACHINE_PROGRAM_V2_ID = new PublicKey(
    'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
    //'Ch3qpQYqr7AvLP6Eph9xxbtneAbzovzuEexAGh48URHS',
);

export const CIVIC = new anchor.web3.PublicKey(
    "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"
);


export interface CandyMachine {
    id: anchor.web3.PublicKey,
    connection: anchor.web3.Connection;
    program: anchor.Program;
    state: CandyMachineState;
}

interface CandyMachineState {
    itemsAvailable: number;
    itemsRedeemed: number;
    itemsRemaining: number;
    treasury: anchor.web3.PublicKey;
    tokenMint: anchor.web3.PublicKey;
    isSoldOut: boolean;
    isActive: boolean;
    goLiveDate: Date;
    price: number;
    gatekeeper: null | {
        expireOnUse: boolean;
        gatekeeperNetwork: anchor.web3.PublicKey;
    };
    endSettings: null | {
        endSettingType: { amount: any },
        number: null | anchor.BN;
    };
    whitelistMintSettings: null | {
        mode: any;
        mint: anchor.web3.PublicKey;
        presale: boolean;
        discountPrice: null | anchor.BN;
    };
    hiddenSettings: null | {
        name: string;
        uri: string;
        hash: Uint8Array;
    };
}

interface BlockhashAndFeeCalculator {
    blockhash: Blockhash;
    feeCalculator: FeeCalculator;
}

export enum SequenceType {
    Sequential,
    Parallel,
    StopOnFailure,
}

const DEFAULT_TIMEOUT = 15000;

export const getUnixTs = () => {
    return new Date().getTime() / 1000;
};


export const awaitTransactionSignatureConfirmation = async (
    txid: anchor.web3.TransactionSignature,
    timeout: number,
    connection: anchor.web3.Connection,
    commitment: anchor.web3.Commitment = "recent",
    queryStatus = false
): Promise<CustomSignatureStatus | null | void> => {

    let done = false;
    let status: CustomSignatureStatus = {
        slot: 0,
        confirmations: 0,
        err: null,
    };
    let subId = 0;

    try {
        status = await new Promise(async (resolve, reject) => {
            setTimeout(() => {
                if (done) {
                    return;
                }
                done = true;
                status.timeout = true;
                reject(status);
            }, timeout);
            try {
                subId = connection.onSignature(
                    txid,
                    (result: any, context: any) => {
                        done = true;
                        status = {
                            err: result.err,
                            slot: context.slot,
                            confirmations: 0,
                        };
                        if (result.err) {
                            let instructionError = result.err.InstructionError;
                            if (instructionError) {
                                for (let i = 0; i < instructionError.length; i++) {
                                    if (instructionError[i].Custom) {
                                        status.customErrCode = instructionError[i].Custom;
                                    }
                                }
                            }
                            reject(status);
                        } else {
                            resolve(status);
                        }
                    },
                    commitment
                );
            } catch (e) {
                done = true;
                console.error("WS error in setup", txid, e);
                reject();
            }
        });
    } catch (e) {
        throw e;
    }
    //@ts-ignore
    if (connection._signatureSubscriptions[subId]) {
        connection.removeSignatureListener(subId);
    }
    done = true;
    return status;
}

/* export */
const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        {pubkey: payer, isSigner: true, isWritable: true},
        {pubkey: associatedTokenAddress, isSigner: false, isWritable: true},
        {pubkey: walletAddress, isSigner: false, isWritable: false},
        {pubkey: splTokenMintAddress, isSigner: false, isWritable: false},
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

export const getCandyMachineState = async (
    anchorWallet: anchor.Wallet,
    candyMachineId: anchor.web3.PublicKey,
    connection: anchor.web3.Connection,
): Promise<CandyMachine> => {
    const provider = new anchor.Provider(connection, anchorWallet, {
        preflightCommitment: "recent",
    });

    const idl: any = await anchor.Program.fetchIdl(
        CANDY_MACHINE_PROGRAM_V2_ID,
        provider
    );
    const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM_V2_ID, provider);

    const state: any = await program.account.candyMachine.fetch(candyMachineId);
    const itemsAvailable = state.data.itemsAvailable.toNumber();
    const itemsRedeemed = state.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;

    let goLiveDate = state.data.goLiveDate.toNumber();
    goLiveDate = new Date(goLiveDate * 1000);
    let price = state.data.whitelistMintSettings?.discountPrice ? state.data.whitelistMintSettings.discountPrice.toNumber() / LAMPORTS_PER_SOL : state.data.price.toNumber() / LAMPORTS_PER_SOL;
    return {
        id: candyMachineId,
        connection,
        program,
        state: {
            itemsAvailable,
            itemsRedeemed,
            itemsRemaining,
            isSoldOut: itemsRemaining === 0,
            isActive:
                state.data.goLiveDate.toNumber() < new Date().getTime() / 1000 &&
                (state.endSettings
                    ? state.endSettings.endSettingType.date
                        ? state.endSettings.number.toNumber() > new Date().getTime() / 1000
                        : itemsRedeemed < state.endSettings.number.toNumber()
                    : true),
            goLiveDate: goLiveDate,
            treasury: state.wallet,
            tokenMint: state.tokenMint,
            gatekeeper: state.data.gatekeeper,
            endSettings: state.data.endSettings,
            whitelistMintSettings: state.data.whitelistMintSettings,
            hiddenSettings: state.data.hiddenSettings,
            price: price,
        }
    };
}

const getMasterEdition = async (
    mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
                Buffer.from("edition"),
            ],
            TOKEN_METADATA_PROGRAM_ID
        )
    )[0];
};

const getMetadata = async (
    mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        )
    )[0];
};

export const getCandyMachineCreator = async (
    candyMachine: anchor.web3.PublicKey,
): Promise<[anchor.web3.PublicKey, number]> => {
    return await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('candy_machine'), candyMachine.toBuffer()],
        CANDY_MACHINE_PROGRAM_V2_ID,
    );
};

export const getAtaForMint = async (
    mint: anchor.web3.PublicKey,
    buyer: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
    return await anchor.web3.PublicKey.findProgramAddress(
        [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );
};

export const getNetworkExpire = async (
    gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
    return await anchor.web3.PublicKey.findProgramAddress(
        [gatekeeperNetwork.toBuffer(), Buffer.from("expire")],
        CIVIC
    );
};

export const getNetworkToken = async (
    wallet: anchor.web3.PublicKey,
    gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
    return await anchor.web3.PublicKey.findProgramAddress(
        [
            wallet.toBuffer(),
            Buffer.from("gateway"),
            Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
            gatekeeperNetwork.toBuffer(),
        ],
        CIVIC
    );
};

export const mintMultipleToken = async (
    candyMachine: any,
    payer: anchor.web3.PublicKey,
    treasury: anchor.web3.PublicKey,
    quantity: number = 2
) => {
    const signersMatrix = [];
    const instructionsMatrix = [];

    for (let index = 0; index < quantity; index++) {
        const mint = anchor.web3.Keypair.generate();

        const userTokenAccountAddress = (
            await getAtaForMint(mint.publicKey, payer)
        )[0];

        const userPayingAccountAddress = candyMachine.state.tokenMint
            ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
            : payer;

        const candyMachineAddress = candyMachine.id;
        const remainingAccounts = [];
        const signers: anchor.web3.Keypair[] = [mint];
        const cleanupInstructions = [];
        const instructions = [
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mint.publicKey,
                space: MintLayout.span,
                lamports:
                    await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
                        MintLayout.span,
                    ),
                programId: TOKEN_PROGRAM_ID,
            }),
            Token.createInitMintInstruction(
                TOKEN_PROGRAM_ID,
                mint.publicKey,
                0,
                payer,
                payer,
            ),
            createAssociatedTokenAccountInstruction(
                userTokenAccountAddress,
                payer,
                payer,
                mint.publicKey,
            ),
            Token.createMintToInstruction(
                TOKEN_PROGRAM_ID,
                mint.publicKey,
                userTokenAccountAddress,
                payer,
                [],
                1,
            ),
        ];

        if (candyMachine.state.gatekeeper) {
            remainingAccounts.push({
                pubkey: (
                    await getNetworkToken(
                        payer,
                        candyMachine.state.gatekeeper.gatekeeperNetwork,
                    )
                )[0],
                isWritable: true,
                isSigner: false,
            });
            if (candyMachine.state.gatekeeper.expireOnUse) {
                remainingAccounts.push({
                    pubkey: CIVIC,
                    isWritable: false,
                    isSigner: false,
                });
                remainingAccounts.push({
                    pubkey: (
                        await getNetworkExpire(
                            candyMachine.state.gatekeeper.gatekeeperNetwork,
                        )
                    )[0],
                    isWritable: false,
                    isSigner: false,
                });
            }
        }
        if (candyMachine.state.whitelistMintSettings) {
            const mint = new anchor.web3.PublicKey(
                candyMachine.state.whitelistMintSettings.mint,
            );

            const whitelistToken = (await getAtaForMint(mint, payer))[0];
            remainingAccounts.push({
                pubkey: whitelistToken,
                isWritable: true,
                isSigner: false,
            });

            if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
                const whitelistBurnAuthority = anchor.web3.Keypair.generate();

                remainingAccounts.push({
                    pubkey: mint,
                    isWritable: true,
                    isSigner: false,
                });
                remainingAccounts.push({
                    pubkey: whitelistBurnAuthority.publicKey,
                    isWritable: false,
                    isSigner: true,
                });
                signers.push(whitelistBurnAuthority);
                const exists =
                    await candyMachine.program.provider.connection.getAccountInfo(
                        whitelistToken,
                    );
                if (exists) {
                    instructions.push(
                        Token.createApproveInstruction(
                            TOKEN_PROGRAM_ID,
                            whitelistToken,
                            whitelistBurnAuthority.publicKey,
                            payer,
                            [],
                            1,
                        ),
                    );
                    cleanupInstructions.push(
                        Token.createRevokeInstruction(
                            TOKEN_PROGRAM_ID,
                            whitelistToken,
                            payer,
                            [],
                        ),
                    );
                }
            }
        }
        if (candyMachine.state.tokenMint) {
            const transferAuthority = anchor.web3.Keypair.generate();

            signers.push(transferAuthority);
            remainingAccounts.push({
                pubkey: userPayingAccountAddress,
                isWritable: true,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: transferAuthority.publicKey,
                isWritable: false,
                isSigner: true,
            });

            instructions.push(
                Token.createApproveInstruction(
                    TOKEN_PROGRAM_ID,
                    userPayingAccountAddress,
                    transferAuthority.publicKey,
                    payer,
                    [],
                    candyMachine.state.price.toNumber(),
                ),
            );
            cleanupInstructions.push(
                Token.createRevokeInstruction(
                    TOKEN_PROGRAM_ID,
                    userPayingAccountAddress,
                    payer,
                    [],
                ),
            );
        }
        const metadataAddress = await getMetadata(mint.publicKey);
        const masterEdition = await getMasterEdition(mint.publicKey);
        const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
            candyMachineAddress,
        );
        instructions.push(
            await candyMachine.program.instruction.mintNft(creatorBump, {
                accounts: {
                    candyMachine: candyMachineAddress,
                    candyMachineCreator,
                    payer: payer,
                    wallet: candyMachine.state.treasury,
                    mint: mint.publicKey,
                    metadata: metadataAddress,
                    masterEdition,
                    mintAuthority: payer,
                    updateAuthority: payer,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                    recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
                    instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                },
                remainingAccounts:
                    remainingAccounts.length > 0 ? remainingAccounts : undefined,
            }),
        );

        signersMatrix.push(signers);
        instructionsMatrix.push(instructions);
    }
    return await sendTransactions(
        candyMachine.program.provider.connection,
        candyMachine.program.provider.wallet,
        instructionsMatrix,
        signersMatrix
    );
};

export const shortenAddress = (address: string, chars = 4): string => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sendTransactions = async (
    connection: Connection,
    wallet: any,
    instructionSet: TransactionInstruction[][],
    signersSet: Keypair[][],
    sequenceType: SequenceType = SequenceType.StopOnFailure,
    commitment: Commitment = "singleGossip",
    block?: BlockhashAndFeeCalculator
): Promise<string[]> => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();

    const unsignedTxns: Transaction[] = [];

    if (!block) {
        block = await connection.getRecentBlockhash(commitment);
    }

    for (let i = 0; i < instructionSet.length; i++) {
        const instructions = instructionSet[i];
        const signers = signersSet[i];

        if (instructions.length === 0) {
            continue;
        }

        let transaction = new Transaction();
        instructions.forEach((instruction) => transaction.add(instruction));
        transaction.recentBlockhash = block.blockhash;
        transaction.setSigners(
            // fee payed by the wallet owner
            wallet.publicKey,
            ...signers.map((s) => s.publicKey)
        );

        if (signers.length > 0) {
            transaction.partialSign(...signers);
        }

        unsignedTxns.push(transaction);
    }

    const signedTxns = await wallet.signAllTransactions(unsignedTxns);

    const pendingTxns: Promise<{ txid: string; slot: number }>[] = [];

    const txIds = [];
    const errors = [];

    for (let i = 0; i < signedTxns.length; i++) {
        const signedTxnPromise = sendSignedTransaction({
            connection,
            signedTransaction: signedTxns[i],
        });

        if (sequenceType !== SequenceType.Parallel) {
            try {
                const {txid} = await signedTxnPromise;
                txIds.push(txid);
            } catch (error) {
                let customError = extractCustomErrorMessage(error);
                errors.push(customError);

                if (sequenceType === SequenceType.StopOnFailure) {
                    break;
                }
            }
        } else {
            pendingTxns.push(signedTxnPromise);
        }
    }

    if (errors.length) {
        let finalMessage;
        let message = Array.from(new Set(errors)).join("; ");
        if (txIds.length) {
            finalMessage = `${txIds.length} were successful, but ${errors.length} failed due to ${message}`;
        } else {
            finalMessage = message;
        }
        throw new Error(finalMessage)
    }

    //TODO: handle this properly
    if (sequenceType === SequenceType.Parallel) {
        await Promise.all(pendingTxns);
    }

    return txIds;
};

const extractCustomErrorMessage = (error: CustomSignatureStatus | any) => {

    if (isCustomSignatureStatus(error)) {
        if (error.timeout) {
            return `Transaction timed out. Please try again`
        }
        switch (error.customErrCode) {
            case 6008:
                return `Insufficient funds. Please fund your wallet.`;

            case 6011:
                return `Minting period hasn't started yet.`;

            case 6010:
                return `The collection is SOLD OUT.`;

            default:
                return GENERIC_ERROR_MESSAGE;
        }
    } else {
        return GENERIC_ERROR_MESSAGE;
    }
}

export async function sendSignedTransaction({signedTransaction, connection, timeout = DEFAULT_TIMEOUT,}: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
}): Promise<{ txid: string; slot: number }> {
    const rawTransaction = signedTransaction.serialize();
    const startTime = getUnixTs();
    let slot = 0;
    const txid: TransactionSignature = await connection.sendRawTransaction(
        rawTransaction,
        {
            skipPreflight: true,
        }
    );

    let done = false;

    (async () => {
        while (!done && getUnixTs() - startTime < timeout) {
            connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
            });
            await sleep(500);
        }
    })();

    try {
        const confirmation = await awaitTransactionSignatureConfirmation(
            txid,
            timeout,
            connection,
            "recent",
            true
        );

        slot = confirmation?.slot || 0;
    } finally {
        done = true;
    }

    return {txid, slot};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function simulateTransaction(
    connection: Connection,
    transaction: Transaction,
    commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
        // @ts-ignore
        connection._disableBlockhashCaching
    );

    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config: any = {encoding: "base64", commitment};
    const args = [encodedTransaction, config];

    // @ts-ignore
    const res = await connection._rpcRequest("simulateTransaction", args);
    if (res.error) {
        throw new Error("failed to simulate transaction: " + res.error.message);
    }
    return res.result;
}

const isCustomSignatureStatus = (tbd: any): tbd is CustomSignatureStatus => {
    return tbd.slot != null;
}

interface CustomSignatureStatus extends SignatureStatus {
    timeout?: boolean;
    customErrCode?: number;

}

export async function getWhitelistSPLTokensCount(
    connection: anchor.web3.Connection,
    ownerAddress: anchor.web3.PublicKey,
    whitelistToken: anchor.web3.PublicKey
): Promise<number> {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        ownerAddress,
        {
            programId: TOKEN_PROGRAM_ID,
        }
    );

    for (let index = 0; index < tokenAccounts.value.length; index++) {
        const tokenAccount = tokenAccounts.value[index];
        const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

        const mint = tokenAccount.account.data.parsed.info.mint;
        if (mint === whitelistToken.toBase58() && tokenAmount.uiAmount > 0) {
            return tokenAmount.uiAmount;
        }
    }
    return 0;
}