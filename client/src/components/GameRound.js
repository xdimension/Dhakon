import { useState, useContext, useEffect } from "react"
import { Web3Context } from "./Web3Provider"

export function GameRound() 
{
    let { vmContract, refreshState } = useContext(Web3Context)
    
    const [currentRound, setCurrentRound] = useState(0)
    
    const getCurrentRound = async() => {
        if (vmContract) {
            console.log('getting current round')
            const round = await vmContract.methods.currentRound().call()
            setCurrentRound(parseInt(round)+1)
        }
    }

    useEffect(() => {
        getCurrentRound()
    }, [vmContract, refreshState])
  
    return (
        <h2>Round: {currentRound}</h2>
    )
}