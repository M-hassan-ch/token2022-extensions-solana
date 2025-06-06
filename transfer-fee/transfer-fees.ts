import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { createATA } from "../utils/create-ata";
import { getConnection } from "../utils/get-connection";
import { getTransferFeeAmount, TOKEN_2022_PROGRAM_ID, transferChecked, unpackAccount, withdrawWithheldTokensFromAccounts } from "@solana/spl-token";
import { PAYER_KEYPAIR } from "../constants";


(async () => {
    const connection = getConnection('devnet');
    const mintPubkey = new PublicKey('FwvQdC4vFWbDx7Uv3wjeVU343gyayaFiVrgd7JEGfxof');
    const senderATA = new PublicKey('GSU3pJXnAULfEgG6Ba9p5nWgWA38UJG4CRy4TVPWcksA');
    // const randomUser = Keypair.generate();
    // const randomUserATA = await createATA(connection, mintPubkey, randomUser);
    const randomUserATA = new PublicKey('93CHCzqyk9GN3QyKfwEhHU3aeBsrDavpo6ugJZDP1tWE');

    const transferTransaction = await transferChecked(
        connection,
        PAYER_KEYPAIR,
        senderATA,
        mintPubkey,
        randomUserATA,
        PAYER_KEYPAIR.publicKey,
        100 * LAMPORTS_PER_SOL,
        9,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    )

    console.log('transferTransaction', transferTransaction);

    const allAccounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
        commitment: "confirmed",
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: mintPubkey.toString(), // Mint Account address
                },
            },
        ],
    });

    const accountsToWithdrawFrom: PublicKey[] = [];

    for (const accountInfo of allAccounts) {
        const account = unpackAccount(
            accountInfo.pubkey, // Token Account address
            accountInfo.account, // Token Account data
            TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
        );

        // Extract transfer fee data from each account
        const transferFeeAmount = getTransferFeeAmount(account);

        // Check if fees are available to be withdrawn
        if (transferFeeAmount !== null && transferFeeAmount.withheldAmount > 0) {
            accountsToWithdrawFrom.push(accountInfo.pubkey); // Add account to withdrawal list
        }
    }

    for (const account of accountsToWithdrawFrom) {
        const withdrawalTransactionSignature = await withdrawWithheldTokensFromAccounts(
            connection,
            PAYER_KEYPAIR, // Transaction fee payer
            mintPubkey, // Mint Account address
            senderATA, // Destination account for fee withdrawal
            PAYER_KEYPAIR, // Authority for fee withdrawal
            [], // Additional signers
            [account], // Token Accounts to withdrawal from
            undefined, // Confirmation options
            TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
        );

        console.log('withdrawalTransactionSignature', withdrawalTransactionSignature);
    }


})();