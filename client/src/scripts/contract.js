import jsonContract from '../contracts/MockDhakon.json';

const contract = (web3) => {
  return new web3.eth.Contract(
    jsonContract.abi,
    "0x7844F0d21d848575f6034b05526012D80725B998"
  )
}
  
export default contract