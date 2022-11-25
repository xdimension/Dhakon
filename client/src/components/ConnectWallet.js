import { useState, useContext, useEffect } from "react"
import { Web3Context } from "./Web3Provider"
import truncateEthAddress from "truncate-eth-address"

export function ConnectWallet() 
{
    let { web3, address, setAddress } = useContext(Web3Context)

    const connectWallet = async () => {
        // get the account's address
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        setAddress(address)       
    }

    return (
        <button style={{background:'blue',color:'#FFF',padding:'20px'}} 
            onClick={connectWallet}>
            <span>{ address ? truncateEthAddress(address) + " (Switch)" : "Connect to Wallet"}</span>
        </button>
    )
}