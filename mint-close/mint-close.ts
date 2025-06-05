import { getConnection } from "../utils/get-connection";
import { PublicKey } from "@solana/web3.js";
import { PAYER_KEYPAIR, PERMANENT_DELEGATE_KEYPAIR } from "../constants";
import { closeAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";


(async () => {
    const connection = getConnection('devnet');
    const mint = new PublicKey('FuE8dAr7pigQUx2SUxNQWbabaed2ckekd49fTTei2Xcc');
    const closeAuthority = PERMANENT_DELEGATE_KEYPAIR;

    try {
        // This will fail bcz PAYER_KEYPAIR is not the close authority
        const transactionSignature = await closeAccount(
            connection,
            PAYER_KEYPAIR, // Transaction fee payer
            mint, // Mint Account address
            PAYER_KEYPAIR.publicKey, // Account to receive lamports from closed account
            PAYER_KEYPAIR, // Close Authority for Mint Account
            undefined, // Additional signers
            undefined, // Confirmation options
            TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
        );
        console.log('transactionSignature', transactionSignature);
    } catch (error) {
        console.log('error', error);
    }

    // This will succeed bcz PERMANENT_DELEGATE_KEYPAIR is the close authority
    const transactionSignature = await closeAccount(
        connection,
        PAYER_KEYPAIR, // Transaction fee payer
        mint, // Mint Account address
        PAYER_KEYPAIR.publicKey, // Account to receive lamports from closed account
        PERMANENT_DELEGATE_KEYPAIR, // Close Authority for Mint Account
        undefined, // Additional signers
        undefined, // Confirmation options
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );
    console.log('transactionSignature', transactionSignature);
})();
