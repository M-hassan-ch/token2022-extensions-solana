

import {
    SystemProgram,
    Keypair,
    Connection,
} from '@solana/web3.js';
import {
    ExtensionType,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

export const getCreateMintInstruction = async (connection: Connection, extensions: ExtensionType[], payer: Keypair) => {
    const mintKeypair = Keypair.generate();
    const mintPubkey = mintKeypair.publicKey;
    const mintLen = getMintLen(extensions)
    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);
    return {
        createMintAccountInstruction: SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintPubkey,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        mintKeypair,
        mintPubkey,
    }
}