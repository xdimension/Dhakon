import { useContext } from "react"
import { Web3Context } from "./Web3Provider"
import truncateEthAddress from "truncate-eth-address"
import { toast } from "react-toastify"

export function ConnectToWallet() 
{
    const { vmContract, address, onAccountsChanged } = useContext(Web3Context)

    const connectToWalletHandler = async() => {
        if (vmContract) {
            onAccountsChanged()
        } else {
            toast.error('Cannot connect to wallet, is Metamask installed?')
        }
    }

    return (
        <button className="vvd" onClick={connectToWalletHandler}>
            <span>{ address ? truncateEthAddress(address) : "Connect to Wallet"}</span>
        </button>
    )
}