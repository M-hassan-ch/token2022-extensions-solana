import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccount, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, Connection } from "@solana/web3.js";
import { PAYER_KEYPAIR } from "../constants";

export const createATA = async (connection: Connection, mintAddress: PublicKey, owner: Keypair) => {
    const associatedTokenAccount = getAssociatedTokenAddressSync(mintAddress, owner.publicKey, true, TOKEN_2022_PROGRAM_ID);
    const txSignature = await createAssociatedTokenAccount(
        connection,
        PAYER_KEYPAIR,
        mintAddress,
        owner.publicKey,
        {
            commitment: 'confirmed',
        },
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        true,
    )
    console.log('txSignature', txSignature.toString());
    console.log('associatedTokenAccount', associatedTokenAccount.toBase58());
    console.log('Owner', owner.publicKey.toBase58());
    return associatedTokenAccount;
}
