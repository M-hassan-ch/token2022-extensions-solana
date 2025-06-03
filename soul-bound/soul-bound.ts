import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getConnection } from "../utils/get-connection";
import { ASSOCIATED_TOKEN_PROGRAM_ID, burn, createAssociatedTokenAccount, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, transfer } from "@solana/spl-token";
import { PAYER_KEYPAIR } from "../constants";
import { Keypair } from "@solana/web3.js";

(async()=>{
    const connection = getConnection('devnet');
    const mintAddress = new PublicKey('Egt9FP5mWzcgANwbkiMnicTRjsmH1JcVuUA8xi4QZNfY');
    const tokenOwnerATA = new PublicKey('HvskrsALKU4LskVPNkVvQBJZeq7B2mRLoNeJwt4NmDCv');
    const tokenOwner = PAYER_KEYPAIR;

    const randomPubKey = new PublicKey('HFyj1VXDzAGadyozQwEQqhpyiFNsd6TYAMsKvNHAx6LQ');
    const randomATAPubkey = new PublicKey('CFNsqS8BuEFaeKhc1sANQD3YgzUUo59Ufm37cEyGd9No');
    
    const transferTxSignature = await transfer(
        connection,
        tokenOwner,
        tokenOwnerATA, //sender ATA
        randomATAPubkey, // receiver ATA
        tokenOwner, 
        BigInt(1 * LAMPORTS_PER_SOL),
        [],
        {
            commitment: 'confirmed',
        },
        TOKEN_2022_PROGRAM_ID,
    )

    console.log('transferTxSignature', transferTxSignature.toString());
    
    // const burnTxSignature = await burn(
    //     connection,
    //     tokenOwner, // Transaction fee payer
    //     tokenOwnerATA, // Burn from
    //     mintAddress, // Mint Account address
    //     tokenOwner.publicKey, // Token Account owner
    //     3 * LAMPORTS_PER_SOL, // Amount
    //     undefined, // Additional signers
    //     undefined, // Confirmation options
    //     TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    //   );

    // console.log('burnTxSignature', burnTxSignature.toString());
})()