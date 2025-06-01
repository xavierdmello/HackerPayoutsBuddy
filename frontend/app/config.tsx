import { flowTestnet, hederaTestnet } from "wagmi/chains";

type PayMePrettyPleaseConfig = {
  [chainId: number]: {
    address: `0x${string}`;
  };
};

const config: PayMePrettyPleaseConfig = {
  [hederaTestnet.id]: {
    address: "0x6aaefea0249b7a04af44a3e7810aef7f82822dab",
  },
  [flowTestnet.id]: {
    address: "0x8ef6655d01E8A51bE8C3De998d7729c0278f4d06",
  },
};

export default config;
