import { hederaTestnet } from "wagmi/chains";

type PayMePrettyPleaseConfig = {
  [chainId: number]: {
    address: `0x${string}`;
  };
};

const config: PayMePrettyPleaseConfig = {
  [hederaTestnet.id]: {
    address: "0x9fca43afbab2b42dd00e49c879accb33ba6ab712",
  },
};

export default config;
