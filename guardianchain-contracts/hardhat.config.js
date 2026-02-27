import "dotenv/config";
import "@nomicfoundation/hardhat-verify";

export default {
  solidity: "0.8.20",

  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: {
      polygon: process.env.ETHERSCAN_API_KEY,
    },
  },
};