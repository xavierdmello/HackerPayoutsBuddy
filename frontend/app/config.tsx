import { hederaTestnet } from "wagmi/chains";

type PayMePrettyPleaseConfig = {
  [chainId: number]: {
    address: `0x${string}`;
  };
};

const config: PayMePrettyPleaseConfig = {
  [hederaTestnet.id]: {
    address: "0x6aaefea0249b7a04af44a3e7810aef7f82822dab",
  },
};

export default config;
