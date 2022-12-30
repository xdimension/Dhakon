import { useContext } from "react"
import { Web3Context } from "./Web3Provider"
import truncateEthAddress from "truncate-eth-address"
import { toast } from "react-toastify"

export function ConnectWallet() 
{
    const { vmContract, address, onAccountsChanged } = useContext(Web3Context)

    const connectToWallet = async() => {
        if (vmContract) {
            onAccountsChanged()
        } else {
            toast.error('Cannot connect to wallet, is Metamask installed?')
        }
    }

    return (
        <button className="vvd" onClick={connectToWallet}>
            <span>{ address ? truncateEthAddress(address) : "Connect to Wallet"}</span>
        </button>
    )
}