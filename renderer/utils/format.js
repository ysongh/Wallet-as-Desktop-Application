export const formatAddress = (address) => {
  if(address.length === 42){
    return address.substring(0,5) + "..." + address.substring(37,42);
  }
  return address;
}

export const formatTransactionHash = (transactionHash) => {
  if(transactionHash.length === 66){
    return transactionHash.substring(0,8) + "..." + transactionHash.substring(58,66);
  }
  return transactionHash;
}