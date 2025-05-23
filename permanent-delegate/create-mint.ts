import {
    sendAndConfirmTransaction,
    Keypair,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import {
    ExtensionType,
    createInitializeMintInstruction,
    createInitializePermanentDelegateInstruction,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { PERMANENT_DELEGATE_KEYPAIR, PAYER_KEYPAIR } from '../constants';
import { getConnection } from '../utils/get-connection';
import { airdrop } from '../utils/airdrop';

(async () => {

    const mintAuthority = PAYER_KEYPAIR.publicKey;
    const mintKeypair = Keypair.generate();

    const mintPubkey = mintKeypair.publicKey;
    const extensions = [ExtensionType.PermanentDelegate];
    const mintLen = getMintLen(extensions);
    const decimals = 9;

    const connection = getConnection('devnet');

    // await airdrop(connection, PAYER_KEYPAIR.publicKey, 5);

    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);
    const mintTransaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: PAYER_KEYPAIR.publicKey,
            newAccountPubkey: mintPubkey,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializePermanentDelegateInstruction(mintPubkey, PERMANENT_DELEGATE_KEYPAIR.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintPubkey, decimals, mintAuthority, null, TOKEN_2022_PROGRAM_ID)
    );
    const txSignature = await sendAndConfirmTransaction(connection, mintTransaction, [PAYER_KEYPAIR, mintKeypair], undefined);

    console.log('txSignature', txSignature);
    console.log('mintPubkey', mintPubkey.toBase58());
    console.log('mintAuthority', mintAuthority.toBase58());
    console.log('payer', PAYER_KEYPAIR.publicKey.toBase58());
    console.log('permanentDelegate', PERMANENT_DELEGATE_KEYPAIR.publicKey.toBase58());
})();