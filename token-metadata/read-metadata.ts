import { getMetadataPointerState, getTokenMetadata } from "@solana/spl-token";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { getMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { getConnection } from "../utils/get-connection";

(async () => {
    const connection = getConnection('devnet');
    const mint = new PublicKey('bcsJ2FCRJhaggvuxExH4MnxrzUk3B92aZSnZgR9w5nE');
    const mintInfo = await getMint(
        connection,
        mint,
        "confirmed",
        TOKEN_2022_PROGRAM_ID,
    );
    const metadataPointer = getMetadataPointerState(mintInfo);
    console.log("\nMetadata Pointer:", JSON.stringify(metadataPointer, null, 2));

    const metadata = await getTokenMetadata(
        connection,
        mint, // Mint Account address
    );
    console.log("\nMetadata:", JSON.stringify(metadata, null, 2));
})();