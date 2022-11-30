import { createContext, useState, useCallback, useEffect } from "react"
import Web3 from "web3"
import contract from "../scripts/contract"

export const Web3Context = createContext({
    web3: null,
    vmContract: null,
})

export function Web3Provider({children}) 
{
    const [web3, setWeb3] = useState()
    const [vmContract, setVmContract] = useState()
    const [address, setAddress] = useState()
    const [isOwner, setIsOwner] = useState()
    const [refresh, setRefresh] = useState()

    const initializeWeb3 = useCallback(async() => {
        console.log('Initializing Web3')

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            const web3 = new Web3(window.ethereum)
            setWeb3(web3)

            const vmContract = contract(web3)
            setVmContract(vmContract)

        } catch(err) {
            console.log(err.message)
        }

    }, [])

    const connectToWallet = useCallback(async() => {
        if (web3 && vmContract) {
            // get the account's address
            const address = (await web3.eth.getAccounts())[0]
            setAddress(address)

            const isOwner = await vmContract.methods.isOwner(address).call()
            setIsOwner(isOwner)

        } else {
            alert('Please connect Metamask to the network')
        }
    }, [web3, vmContract])

    const doRefresh = useCallback(() => setRefresh({}), [])

    const greet = async() => { alert('hello') }

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            initializeWeb3()
        } else {
            // MetaMask required
            alert('Please install MetaMask wallet first')
            window.open("https://metamask.io", "_blank")
        }
    }, [])

    return (
        <Web3Context.Provider
            value={{
                web3,
                vmContract,
                connectToWallet,
                address,
                isOwner,
                refresh,
                doRefresh
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}