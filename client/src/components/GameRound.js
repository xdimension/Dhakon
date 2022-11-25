import { useState, useContext, useEffect } from "react"
import { Web3Context } from "./Web3Provider"

export function GameRound() 
{
    let { vmContract, refresh } = useContext(Web3Context)
    
    const [currentRound, setCurrentRound] = useState(0)
    
    const getCurrentRound = async() => {
        if (vmContract) {
            const round = await vmContract.methods.currentRound().call()
            setCurrentRound(parseInt(round)+1)
        }
    }

    useEffect(() => {
        getCurrentRound()
    }, [vmContract, refresh])
  
    return (
        <h2>Round: {currentRound}</h2>
    )
}