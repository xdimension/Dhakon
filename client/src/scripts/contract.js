import jsonContract from '../contracts/MockDhakon.json';

const contract = (web3) => {
    return new web3.eth.Contract(
      jsonContract.abi,
      "0x48CefD9b1c30089eDd24b436efA76C0C25F97B74"
    )
  }
  
  export default contract