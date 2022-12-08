import { Web3Context } from "./Web3Provider"
import { useContext } from "react"

export function StatusBar()
{
    const { hasWallet } = useContext(Web3Context)

    return (
          !hasWallet && 
          <div className="top-status-bar">
            Please install <a href="https://metamask.io" target="_blank">Metamask</a> wallet to join
          </div>
    )
}