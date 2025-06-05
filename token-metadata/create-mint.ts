import { PAYER_KEYPAIR, PERMANENT_DELEGATE_KEYPAIR } from "../constants";
import { Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getConnection } from "../utils/get-connection";
import {
    createInitializeInstruction,
    createUpdateFieldInstruction,
    pack,
    TokenMetadata,
} from "@solana/spl-token-metadata";
import { createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { getMintLen } from "@solana/spl-token";

(async () => {
    const connection = getConnection('devnet');
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const decimals = 2;
    const mintAuthority = PAYER_KEYPAIR.publicKey;
    const updateAuthority = PAYER_KEYPAIR.publicKey;
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    const metaData: TokenMetadata = {
        updateAuthority: updateAuthority,
        mint: mint,
        name: "OPOS",
        symbol: "OPOS",
        uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
        additionalMetadata: [["description", "Only Possible On Solana"]],
    };
    const metadataLen = pack(metaData).length;
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataExtension + metadataLen,
    );
    const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: PAYER_KEYPAIR.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
    });
    const initializeMetadataPointerInstruction =
        createInitializeMetadataPointerInstruction(
            mint,
            updateAuthority,
            mint,
            TOKEN_2022_PROGRAM_ID,
        );
    const initializeMintInstruction = createInitializeMintInstruction(
        mint,
        decimals,
        mintAuthority,
        null,
        TOKEN_2022_PROGRAM_ID,
    );
    const initializeMetadataInstruction = createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mint,
        updateAuthority: updateAuthority,
        mint: mint,
        mintAuthority: mintAuthority,
        name: metaData.name,
        symbol: metaData.symbol,
        uri: metaData.uri,
    });
    const updateFieldInstruction = createUpdateFieldInstruction({
        programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        metadata: mint, // Account address that holds the metadata
        updateAuthority: PAYER_KEYPAIR.publicKey, // Authority that can update the metadata
        field: metaData.additionalMetadata[0][0], // key
        value: metaData.additionalMetadata[0][1], // value
    });
    const transaction = new Transaction().add(
        createAccountInstruction,
        initializeMetadataPointerInstruction,
        initializeMintInstruction,
        initializeMetadataInstruction,
        updateFieldInstruction, // to initialize custom key-pair in metadata
    );
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [PAYER_KEYPAIR, mintKeypair],
    );
    console.log('Transaction Signature: ', transactionSignature);
    console.log('Mint: ', mint.toBase58());
    console.log('Metadata: ', mint.toBase58());
    console.log('Mint Authority: ', mintAuthority.toBase58());

})();
