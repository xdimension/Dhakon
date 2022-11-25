import { createContext, useEffect, useState, useCallback } from "react"
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
    const [refreshState, setRefreshState] = useState();

    const initializeWeb3 = async() => {

        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                // connect to wallet 
                await window.ethereum.request({ method: "eth_requestAccounts" })
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)

                const vmContract = contract(web3)
                setVmContract(vmContract)
            } catch(err) {
                console.log(err.message)
            }
        } else {
            // MetaMask required
            alert('Please install MetaMask wallet first')
            window.open("https://metamask.io", "_blank")
        }
    }

    const refreshInfo = useCallback(() => setRefreshState({}), [])

    const greet = async() => { alert('hello') }
        
    useEffect(() => {
        initializeWeb3()
    }, [])

    return (
        <Web3Context.Provider
            value={{
                web3,
                vmContract,
                address,
                setAddress,
                refreshState,
                refreshInfo
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}