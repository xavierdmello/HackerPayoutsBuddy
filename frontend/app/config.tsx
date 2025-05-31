import { hederaTestnet } from "wagmi/chains";

type PayMePrettyPleaseConfig = {
  [chainId: number]: {
    address: `0x${string}`;
  };
};

const config: PayMePrettyPleaseConfig = {
  [hederaTestnet.id]: {
    address: "0xfce8263f066ebc996a9185bae320a289ce7078eb",
  },
};

export default config;
