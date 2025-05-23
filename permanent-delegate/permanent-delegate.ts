import { LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
import { getConnection } from "../utils/get-connection";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccount, getAssociatedTokenAddressSync, mintTo, TOKEN_2022_PROGRAM_ID, transfer, transferChecked } from "@solana/spl-token";
import { PAYER_KEYPAIR, PERMANENT_DELEGATE_KEYPAIR } from "../constants";
import { Keypair } from "@solana/web3.js";
import { createATA } from "../utils/create-ata";
import { airdrop } from "../utils/airdrop";

(async()=>{
    const connection = getConnection('devnet');
    const mintAddress = new PublicKey('FqAjrH52SdfS8LvMdRnH61TD9T26Sxpc3Qu5AP3BxzHT');
    const tokenOwnerATA = new PublicKey('7GsoRoAWtsuqdujNXjAaRnEesJpLGNjfJ8fhnAwQ3zrV');
    const tokenOwner = PAYER_KEYPAIR;
    const mintAuthority = PAYER_KEYPAIR;

    const randomPubKey = new PublicKey('Mgni5YaLjB13M69Xt1nVS3FPiDDvaVmiK3Sx7EjFzQ6');
    const randomATAPubkey = new PublicKey('BNvaLyHGFhTbSvbCpvsyQzNEiffZdLiJPZ8VqpnP2SB6');

    // await airdrop(connection, PERMANENT_DELEGATE_KEYPAIR.publicKey, 5);
    // const associatedTokenAccount = await createATA(connection, mintAddress, randomKeypair);

    // const mintTxSignature = await mintTo(
    //     connection,
    //     tokenOwner,
    //     mintAddress,
    //     tokenOwnerATA,
    //     mintAuthority,
    //     BigInt(10 * LAMPORTS_PER_SOL),
    //     [],
    //     {
    //         commitment: 'confirmed',
    //     },
    //     TOKEN_2022_PROGRAM_ID,
    // )

    // console.log('mintTxSignature', mintTxSignature.toString());
    
    // const transferTxSignature = await transfer(
    //     connection,
    //     tokenOwner,
    //     tokenOwnerATA, //sender ATA
    //     randomATAPubkey, // receiver ATA
    //     PERMANENT_DELEGATE_KEYPAIR, 
    //     BigInt(1 * LAMPORTS_PER_SOL),
    //     [],
    //     {
    //         commitment: 'confirmed',
    //     },
    //     TOKEN_2022_PROGRAM_ID,
    // )

    // PERMANENT_DELEGATE
    const transferTxSignature = await transferChecked(
        connection,
        tokenOwner,
        tokenOwnerATA,
        mintAddress,
        randomATAPubkey,
        PERMANENT_DELEGATE_KEYPAIR,
        BigInt(1 * LAMPORTS_PER_SOL),
        9,
        [],
        {
            commitment: 'confirmed',
        },
        TOKEN_2022_PROGRAM_ID,
    )

    console.log('transferTxSignature', transferTxSignature.toString());
})()