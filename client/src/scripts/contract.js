import jsonContract from '../contracts/MockDhakon.json';

const contract = (web3) => {
  return new web3.eth.Contract(
    jsonContract.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  )
}
  
export default contract