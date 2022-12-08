import { Web3Context } from "./Web3Provider"
import { useContext } from "react"

export function StatusBar()
{
    const { hasWallet } = useContext(Web3Context)

    return (
          !hasWallet && 
          <div className="block px-3 py-2 text-center text-bold text-white">
            Please install a wallet first, either <a href="">Metamask</a> or <a href="">WalletConnect</a>
          </div>
    )
}