import { flowMainnet, flowTestnet, hederaTestnet, hedera, rootstockTestnet, rootstock, flareTestnet } from "wagmi/chains";

type PayMePrettyPleaseConfig = {
  [chainId: number]: {
    address: `0x${string}`;
  };
};

const config: PayMePrettyPleaseConfig = {
  [hederaTestnet.id]: {
    address: "0x18b27c5b9655a0189184f1bd1c02b174bf32d81e",
  },
  [flowTestnet.id]: {
    address: "0x8ef6655d01E8A51bE8C3De998d7729c0278f4d06",
  },
  [flowMainnet.id]: {
    address: "0x8ef6655d01E8A51bE8C3De998d7729c0278f4d06",
  },
  [rootstockTestnet.id]: {
    address: "0x8ef6655d01E8A51bE8C3De998d7729c0278f4d06",
  },
  [flareTestnet.id]: {
    address: "0x8ef6655d01E8A51bE8C3De998d7729c0278f4d06",
  },
};

export default config;
