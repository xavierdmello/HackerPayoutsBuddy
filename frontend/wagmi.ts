import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hederaTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "PayMePrettyPlease",
  projectId: "2d35b7e036ea0ce5bac969cca666cad5",
  chains: [hederaTestnet],
  ssr: true,
});
