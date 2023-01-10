import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const ALCHEMY_API_KEY = "Vh68zyFJ2I1tvvpgn99NLL9paBhbvzXu"

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 5000
      },
  /*    accounts: {
        mnemonic: process.env.MNEMONIC as string,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },*/
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
/*      accounts: {
        mnemonic: "",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },*/
    }
  }
};

export default config;
