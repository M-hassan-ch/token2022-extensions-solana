import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const airdrop = async (connection: Connection, receiver: PublicKey, amount: number) => {
    const airdropSignature = await connection.requestAirdrop(receiver, amount * LAMPORTS_PER_SOL);
    return await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });
}