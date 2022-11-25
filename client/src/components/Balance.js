import { useState, useContext, useEffect } from "react"
import { Web3Context } from "./Web3Provider"

export function Balance() {
    const { web3, vmContract, refreshState } = useContext(Web3Context)

    const [balance, setBalance] = useState(0)

    const getBalance = async () => {
        if (vmContract) {
            console.log('getting balance')
            let balance = await vmContract.methods.getBalance().call()
            setBalance(web3.utils.fromWei(balance, 'ether'))
        }
    }

    useEffect(() => {
        getBalance()
    }, [vmContract, refreshState])

    return (
        <>
            Balance: {balance}
            <button style={{background:'green',color:'#FFF',marginLeft:'15px',padding:'10px'}} 
                onClick={getBalance}>
                    <span>Refresh Balance</span>
            </button>
        </>
    )
}