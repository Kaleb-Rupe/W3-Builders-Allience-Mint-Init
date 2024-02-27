import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
// import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import * as anchor from "@project-serum/anchor";
// import { PublicKey } from "@solana/web3.js";

// Define our Mint address
const mint = publicKey("AxpxjcuqFKy4gumyB7iLWNAYVEkRoKWRGh9tdpokRbed");
// const metadataSeeds = [
//   Buffer.from("metadata"),
//   "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
// ];
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create a UMI connection'
// const metadata: PublicKey = findProgramAddressSync(
//   [
//     Buffer.from("metadata"),
//     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//     Buffer.from(mint.toString()),
//   ],
//   TOKEN_METADATA_PROGRAM_ID
// )[0];
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      //   metadata: publicKey(metadata.toString()),
      mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "WBA",
      symbol: "W",
      uri: "",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx
      .sendAndConfirm(umi)
      .then((r) => console.log(r.signature.toString()));
    console.log(result);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
