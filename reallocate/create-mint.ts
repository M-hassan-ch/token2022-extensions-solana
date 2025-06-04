import { createAccount, createMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { PAYER_KEYPAIR } from "../constants";
import { getConnection } from "../utils/get-connection";


(async () => {
    const connection = getConnection('devnet')
    const decimals = 9;

    console.log("Creating mint.......");

    const mintPubkey = await createMint(
        connection,
        PAYER_KEYPAIR, // Payer of the transaction and initialization fees
        PAYER_KEYPAIR.publicKey, // Mint Authority
        null, // Optional Freeze Authority
        decimals, // Decimals of Mint
        undefined, // Optional keypair
        undefined, // Options for confirming the transaction
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    console.log("Mint created", mintPubkey.toBase58());
    console.log("Creating token account.......");

    const tokenAccount = await createAccount(
        connection,
        PAYER_KEYPAIR, // Payer to create Token Account
        mintPubkey, // Mint Account address
        PAYER_KEYPAIR.publicKey, // Token Account owner
        undefined, // Optional keypair, default to Associated Token Account
        undefined, // Confirmation options
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
      );

    console.log("Token account created", tokenAccount.toBase58());


})()