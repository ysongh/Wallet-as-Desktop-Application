import { POLYGON_RPC } from "./keys";

export const NETWORK = {
  "polygon": {
    "chainId": "0x13881",
    "rpc": POLYGON_RPC,
    "networkName": "Polygon Testnet",
    "tokenSymbol": "MATIC"
  },
  "chiado": {
    "chainId": "0x27d8",
    "rpc": "https://rpc.eu-central-2.gateway.fm/v4/gnosis/archival/chiado",
    "networkName": "Chiado Testnet",
    "tokenSymbol": "Chiado xDai"
  },
  "mandala": {
    "chainId": "0x253",
    "rpc": "https://eth-rpc-mandala.aca-staging.network",
    "networkName": "Mandala Testnet",
    "tokenSymbol": "mACA"
  }
}