import { GATEWAY_KEY } from "../keys";

export const getBalance = async (addresss) => {
  try {
    const response = await fetch('https://rpc.eu-central-2.gateway.fm/v4/gnosis/archival/chiado', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GATEWAY_KEY}`
      },
      body: JSON.stringify({
          jsonrpc: '2.0',
          id: 0,
          method: 'eth_getBalance',
          params: [addresss, 'latest']
      })
    })
    const data = await response.json()
    console.log(data);
    return parseInt(data.result, 16);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export const getGasFee = async () => {
  try {
    const response = await fetch('https://rpc.eu-central-2.gateway.fm/v4/gnosis/archival/chiado', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GATEWAY_KEY}`
      },
      body: JSON.stringify({
          jsonrpc: '2.0',
          id: 0,
          method: 'eth_gasPrice'
      })
    })
    const data = await response.json()
    console.log(data);
    return parseInt(data.result, 16);
  } catch (error) {
    console.error(error);
    return 0;
  }
}