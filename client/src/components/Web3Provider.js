import { createContext, useState, useCallback } from "react"
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
    const [refresh, setRefresh] = useState()
    const [gameRound, setGameRound] = useState(0)
    const [roundEndsAt, setRoundEndsAt] = useState()
    const [balance, setBalance] = useState(0)
    const [numOfPlayers, setNumOfPlayers] = useState(0)

    const initializeWeb3 = useCallback(async() => {

        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                // connect to wallet 
                await window.ethereum.request({ method: "eth_requestAccounts" })
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)

                const vmContract = contract(web3)
                setVmContract(vmContract)

                // get the account's address
                const address = (await web3.eth.getAccounts())[0]
                setAddress(address)

                const balance = await vmContract.methods.getBalance().call()
                setBalance(web3.utils.fromWei(balance, 'ether'))

                const round = await vmContract.methods.currentRound().call()
                setGameRound(parseInt(round)+1)

                const roundEnds = await vmContract.methods.roundEndsAt().call()
                setRoundEndsAt(roundEnds)

            } catch(err) {
                console.log(err.message)
            }
        } else {
            // MetaMask required
            alert('Please install MetaMask wallet first')
            window.open("https://metamask.io", "_blank")
        }
    }, [])

    const doRefresh = useCallback(() => setRefresh({}), [])

    const greet = async() => { alert('hello') }

    return (
        <Web3Context.Provider
            value={{
                initializeWeb3,
                web3,
                vmContract,
                address,
                gameRound,
                roundEndsAt,
                balance,
                numOfPlayers,
                setNumOfPlayers,
                refresh,
                doRefresh
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}