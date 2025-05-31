import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hederaTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "PayMePrettyPlease",
  projectId: "YOUR_PROJECT_ID",
  chains: [hederaTestnet],
  ssr: true,
});
