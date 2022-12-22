const getContractJson = async() => {
  return (await import('../contracts/' + process.env.REACT_APP_CONTRACT_JSON)).default;
}

const Contract = async(web3) => {
  const contractJson = await getContractJson()

  return new web3.eth.Contract(
    contractJson.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  )
}
  
export default Contract