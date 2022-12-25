import { Web3Context } from "./Web3Provider"
import { useContext } from "react"
import { GameContext } from "./GameProvider"

export function StatusBar()
{
    const { networkId, hasWallet } = useContext(Web3Context)
    const { config } = useContext(GameContext)

    return (
      <>
          {!hasWallet && 
          <div className="top-status-bar">
            Please install <a href="https://metamask.io" target="_blank">Metamask</a> wallet to join
          </div>}
          
          {networkId != 0 && networkId != config.network.id &&
          <div className="top-status-bar">
            You must connect to {config.network.name} network to join
          </div>}
      </>
    )
}