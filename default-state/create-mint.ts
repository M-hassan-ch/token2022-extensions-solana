import {
    sendAndConfirmTransaction,
    Transaction,
} from '@solana/web3.js';
import {
    ExtensionType,
    createInitializeMintInstruction,
    TOKEN_2022_PROGRAM_ID,
    createInitializeDefaultAccountStateInstruction,
    AccountState,
} from '@solana/spl-token';
import { PAYER_KEYPAIR } from '../constants';
import { getConnection } from '../utils/get-connection';
import { getCreateMintInstruction } from '../utils/get-create-mint-instruction';
import { createATA } from '../utils/create-ata';

(async () => {
    const mintAuthority = PAYER_KEYPAIR.publicKey;
    const decimals = 9;
    const extensions = [ExtensionType.DefaultAccountState];
    const defaultState = AccountState.Frozen;
    const connection = getConnection('devnet');

    // await airdrop(connection, PAYER_KEYPAIR.publicKey, 5);
    const { createMintAccountInstruction, mintPubkey, mintKeypair } = await getCreateMintInstruction(connection, extensions, PAYER_KEYPAIR);

    const mintTransaction = new Transaction().add(
        createMintAccountInstruction,
        createInitializeDefaultAccountStateInstruction(mintPubkey, defaultState, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintPubkey, decimals, mintAuthority, mintAuthority, TOKEN_2022_PROGRAM_ID)
    );
    const txSignature = await sendAndConfirmTransaction(connection, mintTransaction, [PAYER_KEYPAIR, mintKeypair], undefined);

    console.log('txSignature', txSignature);
    console.log('mintPubkey', mintPubkey.toBase58());
    console.log('mintAuthority', mintAuthority.toBase58());
    console.log('payer', PAYER_KEYPAIR.publicKey.toBase58());

    await createATA(connection, mintPubkey, PAYER_KEYPAIR);
})();