import { useState, useContext, useEffect } from "react"
import { Web3Context } from "./Web3Provider"
import truncateEthAddress from "truncate-eth-address"

export function ConnectWallet() 
{
    const { address, connectToWallet } = useContext(Web3Context)

    return (
        <button className="vvd" onClick={connectToWallet}>
            <span>{ address ? truncateEthAddress(address) : "Connect to Wallet"}</span>
        </button>
    )
}