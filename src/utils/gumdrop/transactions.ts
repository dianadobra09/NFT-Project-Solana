import {Commitment, Connection, SignatureStatus, Transaction, TransactionSignature,} from '@solana/web3.js';
import {sleep} from "oyster-common";
import {GENERIC_ERROR_MESSAGE} from '../constants';
import {CLUSTERS} from './gumdrop-ids';

export const DEFAULT_TIMEOUT = 15000;

export const getUnixTs = () => {
    return new Date().getTime() / 1000;
};


export const envFor = (
    connection: Connection
): string => {
    const endpoint = (connection as any)._rpcEndpoint;

    let cluster = CLUSTERS.find(c => c.url === endpoint);
    // const regex = /https:\/\/api.([^.]*).solana.com/;
    // const match = endpoint.match(regex);
    // if (match[1]) {
    //     return match[1];
    // }
    if (cluster){
        return cluster.name
    }
    return "mainnet-beta";
}

export const explorerLinkFor = (
    txid: TransactionSignature,
    connection: Connection
): string => {
    return `https://solscan.io/tx/${txid}?cluster=${envFor(connection)}`;
}

export async function sendSignedTransaction({
                                                signedTransaction,
                                                connection,
                                                timeout = DEFAULT_TIMEOUT,
                                            }: {
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
    let txid:TransactionSignature = await connection.sendRawTransaction(
        rawTransaction,
        {
            skipPreflight: true,
        },
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
            'confirmed',
            true,
        );

        slot = confirmation?.slot || 0;

    } finally {
        done = true;
    }

    return {txid, slot};
}


export async function awaitTransactionSignatureConfirmation(
    txid: TransactionSignature,
    timeout: number,
    connection: Connection,
    commitment: Commitment = 'recent',
    queryStatus = false,
): Promise<CustomSignatureStatus> {
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
                    (result: any, context) => {
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
                    commitment,
                );
            } catch (e) {
                done = true;
                reject();
            }
        });
    } catch (e) {
        throw e;
    }
    //@ts-ignore
    if (connection._signatureSubscriptions[subId])
        connection.removeSignatureListener(subId);
    done = true;
    return status;
}


export const extractCustomErrorMessage = (error: CustomSignatureStatus | any) => {

    if (isCustomSignatureStatus(error)) {
        if (error.timeout){
            return `Transaction timed out. Please try again`
        }
        switch (error.customErrCode) {

            case 6008:
                return `Insufficient funds. Please fund your wallet.`;

            case 6009:
                return `Token transfer failed`;

            default:
                return GENERIC_ERROR_MESSAGE;
        }
    } else {
        return GENERIC_ERROR_MESSAGE;
    }
}

const isCustomSignatureStatus = (tbd: any): tbd is CustomSignatureStatus => {
    return tbd.slot != null;
}

interface CustomSignatureStatus extends SignatureStatus {
    timeout?: boolean;
    customErrCode?: number;

}