import { createContext, useState, useCallback, useEffect } from "react"
import Web3 from "web3"

const getContractJson = async() => {
    return (await import('../contracts/' + process.env.REACT_APP_CONTRACT_JSON)).default;
}

const Contract = async(web3) => {
    const contractJson = await getContractJson()
    
    return new web3.eth.Contract(
        contractJson.abi,
        process.env.REACT_APP_CONTRACT_ADDRESS
    )
}

export const Web3Context = createContext({
    web3: null,
    vmContract: null,
    address: '',
    isOwner: false,
})

export function Web3Provider({children}) 
{
    const [web3, setWeb3] = useState()
    const [hasWallet, setHasWallet] = useState(true)
    const [vmContract, setVmContract] = useState()
    const [address, setAddress] = useState()
    const [isOwner, setIsOwner] = useState()
    const [refresh, setRefresh] = useState()

    const onAccountsChanged = useCallback(async() => {
        console.log('Handle accounts changed')

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

            if (accounts[0] !== address) {
                setAddress(accounts[0]);

                if (vmContract) {
                    const isOwner = await vmContract.methods.isOwner(accounts[0]).call()
                    setIsOwner(isOwner)
                }
            }
        } catch(err) {
            console.log(err.message)
        }
    }, [vmContract, address])

    const initializeWeb3 = useCallback(async() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            console.log('Initializing Web3')

            try {
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)

                const contract = await Contract(web3)
                setVmContract(contract)

                setHasWallet(true)

            } catch(err) {
                console.log(err.message)
            }
        } else {
            // A wallet is required
            setHasWallet(false)
        }
    }, [])

    const connectToWallet = useCallback(async() => {
        if (vmContract) {
            onAccountsChanged()
        } else {
            alert('Please connect Metamask to the network')
        }
    }, [vmContract])

    const doRefresh = useCallback(() => setRefresh({}), [])

    useEffect(() => {
        initializeWeb3()
    }, [])

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', onAccountsChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', onAccountsChanged)
            }
        }
    }, [vmContract, address])

    return (
        <Web3Context.Provider
            value={{
                web3,
                hasWallet,
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