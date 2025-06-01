import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  flowMainnet,
  flowTestnet,
  hederaTestnet,
  hedera,
  rootstockTestnet,
  rootstock,
  flareTestnet,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "PayMePrettyPlease",
  projectId: "2d35b7e036ea0ce5bac969cca666cad5",
  chains: [
    // Hedera networks
    hederaTestnet,

    // Flow networks
    flowTestnet,
    flowMainnet,
    // Rootstock networks
    rootstockTestnet,

    // Flare networks
    flareTestnet,
  ],
  ssr: true,
});
