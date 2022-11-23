import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Stats } from "./components/Stats";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { useState, useEffect, useMemo } from 'react';
import Web3 from 'web3';
import contract from './scripts/contract';
import truncateEthAddress from 'truncate-eth-address'

let web3;
let vmContract;
let address = '';

function App() {
  const [error, setError] = useState('')
  
  const [currentRound, setCurrentRound] = useState(0)
  const [balance, setBalance] = useState(0)
  const [displayedAddress, setDisplayedAddress] = useState('')

  const getBalance = async () => {
    if (vmContract) {
      let balance = await vmContract.methods.getBalance().call()
      setBalance(web3.utils.fromWei(balance, 'ether'))
    }
  }

  const getCurrentRound = async() => {
    if (vmContract) {
      const round = await vmContract.methods.currentRound().call()
      setCurrentRound(parseInt(round)+1)
    }
  }

  const refreshInfo = async() => {
    getCurrentRound()
    getBalance()
  }

  const enterPot = async() => {
    try {
      await vmContract.methods.enter()
            .send({
              from: address,
              value: web3.utils.toWei('0.1', 'ether')
            })

      refreshInfo()
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

      refreshInfo()
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

      refreshInfo();
    } catch(err) {
      console.log(err.message)
    }
  }

  const connectWallet = async () => {
    // check if MetaMask is installed 
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          // request wallet connect 
          await window.ethereum.request({ method: "eth_requestAccounts" })
          // create web3 instance and set to state var 
          web3 = new Web3(window.ethereum)

          // get list of accounts 
          const accounts = await web3.eth.getAccounts()
          // keep Account 0 address
          address = accounts[0]
          setDisplayedAddress(truncateEthAddress(address))

          // create local contract copy 
          vmContract = contract(web3)

          refreshInfo()

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
            onClick={connectWallet}>
              <span>{ address ? displayedAddress + " (Switch)" : "Connect to Wallet"}</span>
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
          Balance: {balance}
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
