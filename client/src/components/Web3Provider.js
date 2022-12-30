import { createContext, useState, useCallback, useEffect } from "react"
import Web3 from "web3"
import { config } from "../config"


const getContractJson = async() => {
    return (await import('../contracts/' + config.contract.jsonFile)).default;
}

const Contract = async(web3) => {
    const contractJson = await getContractJson()
    
    return new web3.eth.Contract(
        contractJson.abi,
        config.contract.address
    )
}

export const Web3Context = createContext({
    web3: null,
    networkId: 0,
    vmContract: null,
    address: '',
    isOwner: false,
})

export function Web3Provider({children}) 
{
    const [web3, setWeb3] = useState()
    const [hasWallet, setHasWallet] = useState(true)
    const [networkId, setNetworkId] = useState(0)
    const [vmContract, setVmContract] = useState()
    const [address, setAddress] = useState()
    const [isOwner, setIsOwner] = useState()
    const [refresh, setRefresh] = useState()

    const onNetworkChanged = useCallback(async() => {
        if (web3) {
            const netId = await web3.eth.net.getId()

            console.log(`The network has changed to ${netId}`)
            setNetworkId(netId)
        }
    }, [web3])

    const onAccountsChanged = useCallback(async() => {
        console.log('Handle accounts changed')

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

            if (accounts.length > 0 && accounts[0] !== address) {
                setAddress(accounts[0]);

                if (vmContract) {
                    const isOwner = await vmContract.methods.isOwner(accounts[0]).call()
                    setIsOwner(isOwner)
                }

                doRefresh()
            }
        } catch(err) {
            console.log(err.message)
        }
    }, [vmContract, address])

    const initializeWeb3 = useCallback(async() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            console.log('Initializing Web3')
            setHasWallet(true)

            try {
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)

                const contract = await Contract(web3)
                setVmContract(contract)

            } catch(err) {
                console.log(err.message)
            }
        } else {
            // A wallet is required
            setHasWallet(false)
        }
    }, [])

    const doRefresh = useCallback(() => setRefresh({}), [])

    useEffect(() => {
        initializeWeb3()
    }, [])

    useEffect(() => {
        if (window.ethereum) {
            onNetworkChanged()

            window.ethereum.on('chainChanged', onNetworkChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', onNetworkChanged)
            }
        }
    }, [web3])
  
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
                networkId,
                vmContract,
                address,
                onAccountsChanged,
                isOwner,
                refresh,
                doRefresh
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}