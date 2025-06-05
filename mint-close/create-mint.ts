import {
    sendAndConfirmTransaction,
    Keypair,
    Transaction,
} from '@solana/web3.js';
import {
    ExtensionType,
    createInitializeMintInstruction,
    createInitializeNonTransferableMintInstruction,
    TOKEN_2022_PROGRAM_ID,
    createInitializeMintCloseAuthorityInstruction,
} from '@solana/spl-token';
import { PAYER_KEYPAIR, PERMANENT_DELEGATE_KEYPAIR } from '../constants';
import { getConnection } from '../utils/get-connection';
import { getCreateMintInstruction } from '../utils/get-create-mint-instruction';
import { airdrop } from '../utils/airdrop';

(async () => {
    const mintAuthority = PAYER_KEYPAIR.publicKey;
    const decimals = 9;
    const extensions = [ExtensionType.MintCloseAuthority];
    const connection = getConnection('devnet');
    const closeAuthority = PERMANENT_DELEGATE_KEYPAIR;
    const { createMintAccountInstruction, mintKeypair, mintPubkey } = await getCreateMintInstruction(connection, extensions, PAYER_KEYPAIR);

    await airdrop(connection, PAYER_KEYPAIR.publicKey, 5);

    const mintTransaction = new Transaction().add(
        createMintAccountInstruction,
        createInitializeMintCloseAuthorityInstruction(mintPubkey, closeAuthority.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintPubkey, decimals, mintAuthority, null, TOKEN_2022_PROGRAM_ID)
    );
    const txSignature = await sendAndConfirmTransaction(connection, mintTransaction, [PAYER_KEYPAIR, mintKeypair], undefined);

    console.log('txSignature', txSignature);
    console.log('mintPubkey', mintPubkey.toBase58());
    console.log('mintAuthority', mintAuthority.toBase58());
    console.log('payer', PAYER_KEYPAIR.publicKey.toBase58());
    console.log('closeAuthority', closeAuthority.publicKey.toBase58());
})();