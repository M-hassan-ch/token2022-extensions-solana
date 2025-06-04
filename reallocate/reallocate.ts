import { createEnableRequiredMemoTransfersInstruction, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { createReallocateInstruction } from "@solana/spl-token";
import { ExtensionType } from "@solana/spl-token";
import { getConnection } from "../utils/get-connection";
import { PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { PAYER_KEYPAIR } from "../constants";


(async () => {
    const connection = getConnection('devnet');
    const mintPubkey = new PublicKey('9czebmCCe1wssjV6RkkaEbw5sQB8tKhwuVXLeq7x1Hch');
    const tokenAccount = new PublicKey('3Y4MNQDsEzrMKmW3rjzEix5V9ZcNnoUDD2t9T6tzmRqT');

    const extensions = [ExtensionType.MemoTransfer];
    const reallocateInstruction = createReallocateInstruction(
        tokenAccount, // Token Account address
        PAYER_KEYPAIR.publicKey, // Payer to reallocate data
        extensions, // Extensions to reallocate for
        PAYER_KEYPAIR.publicKey, // Token Account owner
        undefined, // Additional signers
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );
    const enableRequiredMemoTransfersInstruction = createEnableRequiredMemoTransfersInstruction(
        tokenAccount, // Token Account address
        PAYER_KEYPAIR.publicKey, // Token Account Owner
        undefined, // Additional signers
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    const transaction = new Transaction().add(
        reallocateInstruction,
        enableRequiredMemoTransfersInstruction,
    );

    // Send Transaction
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [PAYER_KEYPAIR],
    );

    console.log(
        "\nReallocate:",
        transactionSignature,
    );
})();   