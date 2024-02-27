import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "./wallet/wba-wallet.json";
import { publicKey } from "@metaplex-foundation/umi";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("AxpxjcuqFKy4gumyB7iLWNAYVEkRoKWRGh9tdpokRbed");

(async () => {
  try {
    // Create an ATA
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(`Your ata is: \n${ata.address.toBase58()}\n`);

    // Mint to ATA
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair,
      token_decimals * 100n
    );
    console.log(`Your mint txid: ${mintTx}`);
  } catch (error: any) {
    if (error.name === "TokenAccountNotFoundError") {
      console.log(
        "Failed to find Token Account. This is probably because we are trying to use it before a block has been found confirming it. Wait a few seconds and try again."
      );
    } else {
      console.log(`Oops, something went wrong: ${error}`);
    }
  }
})();
