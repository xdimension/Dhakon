import jsonContract from '../contracts/MockDhakon.json';

const contract = (web3) => {
    return new web3.eth.Contract(
      jsonContract.abi,
      "0x56ab6eab59BdDBACf37091812E4C8086681eB517"
    )
  }
  
  export default contract