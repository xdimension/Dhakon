import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Stats } from "./components/Stats";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import contract from './scripts/contract';

function App() {
  const [error, setError] = useState('')
  const [address, setAddress] = useState(null)
  const [vmContract, setVmContract] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [balance, setBalance] = useState('')
  const [balanceDisplayed, setBalanceDisplayed] = useState('')
  const [currentRound, setCurrentRound] = useState(0)

  useEffect(() => {
    getBalance();
    getCurrentRound();
  }, [vmContract, address])

  const getBalance = async () => {
    if (vmContract) {
      const balance = await vmContract.methods.getBalance().call()
      setBalance(balance)
      setBalanceDisplayed(web3.utils.fromWei(balance, 'ether'));
    }
  }

  const getCurrentRound = async() => {
    if (vmContract) {
      const round = await vmContract.methods.currentRound().call()
      setCurrentRound(parseInt(round)+1)
    }
  }

  const enterPot = async() => {
    try {
      await vmContract.methods.enter()
            .send({
              from: address,
              value: web3.utils.toWei('0.1', 'ether')
            })
    } catch(err) {
      console.log(err.message)
    }
  }

  const pickWinner = async() => {
    console.log('picking Winner')
    try {
      await vmContract.methods.pickWinner()
            .send({
              from: address
            })
    } catch(err) {
      console.log(err.message)
    }
  }

  const payWinner = async() => {
    console.log('paying Winner')
    try {
      await vmContract.methods.payWinner()
            .send({
              from: address
            })
    } catch(err) {
      console.log(err.message)
    }
  }

  const connectWalletHandler = async () => {
    // check if MetaMask is installed 
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          // request wallet connect 
          await window.ethereum.request({ method: "eth_requestAccounts" })
          // create web3 instance and set to state var 
          const web3 = new Web3(window.ethereum)
          // set web3 instance 
          setWeb3(web3)
          // get list of accounts 
          const accounts = await web3.eth.getAccounts()
          // set Account 1 to React state var 
          setAddress(accounts[0])

          // create local contract copy 
          const vm = contract(web3)
          setVmContract(vm)

        } catch(err) {
          setError(err.message)
        }
    } else {
        // meta mask is not installed
        console.log("Please install MetaMask")
    }
  }
  

  return (
    <div className="App">
      <NavBar />
      
      <Banner />

      <div style={{paddingTop:'50px', paddingBottom:'150px'}}>

        <div style={{marginTop:'20px'}}>
          <button style={{background:'blue',color:'#FFF',padding:'20px'}} 
            onClick={connectWalletHandler}><span>Connect to Wallet</span>
          </button>
        </div>

        <div style={{marginTop:'50px'}}>
          <h2>Round: {currentRound}</h2>
        </div>

        <div style={{marginTop:'20px'}}>
          <button style={{background:'red',color:'#FFF',padding:'20px'}} 
            onClick={enterPot}><span>Join Pot</span>
          </button>
        </div>

        <div style={{marginTop:'20px'}}>
          Balance: {balanceDisplayed}
          <button style={{background:'green',color:'#FFF',marginLeft:'15px',padding:'10px'}} 
          onClick={getBalance}><span>Refresh Balance</span>
        </button>
        </div>


        <div style={{marginTop:'50px'}}>
          <button style={{background:'orange',color:'#FFF',padding:'20px'}} 
            onClick={pickWinner}><span>Pick Winner</span>
          </button>
        </div>

        <div style={{marginTop:'20px'}}>
          <button style={{background:'red',color:'#FFF',padding:'20px'}} 
            onClick={payWinner}><span>Pay Winner</span>
          </button>
        </div>

      </div>

      <Stats />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
