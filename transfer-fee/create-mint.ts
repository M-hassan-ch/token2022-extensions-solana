import {
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    Transaction,
} from '@solana/web3.js';
import {
    ExtensionType,
    createInitializeMintInstruction,
    TOKEN_2022_PROGRAM_ID,
    createInitializeTransferFeeConfigInstruction,
    mintTo,
} from '@solana/spl-token';
import { PAYER_KEYPAIR } from '../constants';
import { getConnection } from '../utils/get-connection';
import { getCreateMintInstruction } from '../utils/get-create-mint-instruction';
import { airdrop } from '../utils/airdrop';
import { createATA } from '../utils/create-ata';

(async () => {
    const mintAuthority = PAYER_KEYPAIR.publicKey;
    const decimals = 9;
    const extensions = [ExtensionType.TransferFeeConfig];
    const connection = getConnection('devnet');
    const transferFeeConfigAuthority = PAYER_KEYPAIR;
    const withdrawWithheldAuthority = PAYER_KEYPAIR;
    const feeBasisPoints = 1000;
    const maxFee = BigInt(100 * LAMPORTS_PER_SOL);

    const { createMintAccountInstruction, mintKeypair, mintPubkey } = await getCreateMintInstruction(connection, extensions, PAYER_KEYPAIR);

    // await airdrop(connection, PAYER_KEYPAIR.publicKey, 5);

    const mintTransaction = new Transaction().add(
        createMintAccountInstruction,
        createInitializeTransferFeeConfigInstruction(mintPubkey, transferFeeConfigAuthority.publicKey, withdrawWithheldAuthority.publicKey, feeBasisPoints, maxFee, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintPubkey, decimals, mintAuthority, null, TOKEN_2022_PROGRAM_ID)
    );
    const txSignature = await sendAndConfirmTransaction(connection, mintTransaction, [PAYER_KEYPAIR, mintKeypair], undefined);

    console.log('txSignature', txSignature);
    console.log('mintPubkey', mintPubkey.toBase58());
    console.log('mintAuthority', mintAuthority.toBase58());
    console.log('payer', PAYER_KEYPAIR.publicKey.toBase58());

    const ata = await createATA(connection, mintPubkey, PAYER_KEYPAIR);

    const mintTransactionSignature = await mintTo(
        connection,
        PAYER_KEYPAIR, // Transaction fee payer
        mintPubkey, // Mint Account address
        ata, // Mint to
        mintAuthority, // Mint Authority address
        1000 * LAMPORTS_PER_SOL, // Amount
        undefined, // Additional signers
        undefined, // Confirmation options
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
      );
      
})();