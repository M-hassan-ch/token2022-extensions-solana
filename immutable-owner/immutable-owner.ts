import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { AuthorityType, setAuthority } from "@solana/spl-token";
import { PAYER_KEYPAIR } from "../constants";
import { createATA } from "../utils/create-ata";
import { getConnection } from "../utils/get-connection";
import { Keypair, PublicKey } from "@solana/web3.js";


(async () => {
    const connection = getConnection('devnet');
    const tokenOwner = PAYER_KEYPAIR;
    const tokenOwnerATA = new PublicKey('AHSWm7zS5Bfdscoh9cSUVGVDYfXyxYXJoUtAQFMzjKGt');

    const txSignature = await setAuthority(
        connection,
        tokenOwner,// payer
        tokenOwnerATA,
        tokenOwner,
        AuthorityType.AccountOwner,
        Keypair.generate().publicKey,// new authority
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    )

    console.log("txSignature", txSignature);

})();
