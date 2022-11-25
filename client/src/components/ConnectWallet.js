import { useState, useContext, useEffect } from "react"
import { Web3Context } from "./Web3Provider"
import truncateEthAddress from "truncate-eth-address"

export function ConnectWallet() 
{
    let { initializeWeb3, address } = useContext(Web3Context)

    return (
        <button style={{background:'blue',color:'#FFF',padding:'20px'}} 
            onClick={initializeWeb3}>
            <span>{ address ? truncateEthAddress(address) + " (Switch)" : "Connect to Wallet"}</span>
        </button>
    )
}