import { hederaTestnet } from "wagmi/chains";

type PayMePrettyPleaseConfig = {
  [chainId: number]: {
    address: `0x${string}`;
  };
};

const config: PayMePrettyPleaseConfig = {
  [hederaTestnet.id]: {
    address: "0x15cf9d1eaccc4767470b3bc6d5a37e49a5715993",
  },
};

export default config;
