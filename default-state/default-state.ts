import { thawAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { mintTo } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { PAYER_KEYPAIR } from "../constants";
import { getConnection } from "../utils/get-connection";

(async () => {
    const connection = getConnection('devnet');
    const mint = new PublicKey('CRfJstigW717UBgH3m1dXrMRe2Udpm1WRJRkgzmGMH5n');
    const payerAta = new PublicKey('bdPKZd7uF5rtTsZGoxc6qBMYV5fQ62zkpXzf6XWAHFW');

    // This will fail because the account is frozen
    // await mintTo(
    //     connection,
    //     PAYER_KEYPAIR, // Transaction fee payer
    //     mint, // Mint Account address
    //     payerAta, // Destination for minting
    //     PAYER_KEYPAIR.publicKey, // Mint Authority
    //     100, // Amount to mint
    //     undefined, // Additional signers
    //     undefined, // Confirmation options
    //     TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    // );

    const transactionSignature = await thawAccount(
        connection,
        PAYER_KEYPAIR, // Transaction fee payer
        payerAta, // Token Account to unfreeze
        mint, // Mint Account address
        PAYER_KEYPAIR, // Freeze Authority
        undefined, // Additional signers
        undefined, // Confirmation options
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    console.log('transactionSignature', transactionSignature);

    // this willl work because ATA is thawn
    const mintToTransactionSignature = await mintTo(
        connection,
        PAYER_KEYPAIR, // Transaction fee payer
        mint, // Mint Account address
        payerAta, // Destination for minting
        PAYER_KEYPAIR.publicKey, // Mint Authority
        10 * LAMPORTS_PER_SOL   , // Amount to mint
        undefined, // Additional signers
        undefined, // Confirmation options
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    console.log('mintTo transactionSignature', mintToTransactionSignature);
})();
