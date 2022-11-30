import { createContext, useState, useCallback, useEffect, useContext } from "react"
import { Web3Context } from "./Web3Provider"

export const GameContext = createContext({
    gameRound: 0,
    balance: 0,
    numOfPlayers: 0,
})

export function GameProvider({children}) 
{
    const [balance, setBalance] = useState(0)
    const [gameRound, setGameRound] = useState(0)
    const [roundEndsAt, setRoundEndsAt] = useState()
    const [numOfPlayers, setNumOfPlayers] = useState(0)

    const { web3, vmContract, address, refresh, doRefresh } = useContext(Web3Context)

    const pickWinner = useCallback(async() => {
        if (vmContract && address) {
            console.log('Picking the Winner')

            try {
                await vmContract.methods.pickWinner()
                    .send({
                        from: address
                    })

                doRefresh()
            } catch(err) {
                console.log(err.message)
            }
        }
    }, [vmContract, address])

    const payWinner = useCallback(async() => {
        if (vmContract && address) {
            console.log('Paying the Winner')
            
            try {
                await vmContract.methods.payWinner()
                    .send({
                        from: address
                    })

                doRefresh()
            } catch(err) {
                console.log(err.message)
            }
        }
    }, [vmContract, address])

    const getGameInfo = useCallback(async() => {
        if (vmContract) {
            console.log('Getting Game Info')

            const balance = await vmContract.methods.getBalance().call()
            setBalance(web3.utils.fromWei(balance, 'ether'))

            const round = await vmContract.methods.currentRound().call()
            setGameRound(parseInt(round)+1)

            const roundEnds = await vmContract.methods.roundEndsAt().call()
            setRoundEndsAt(roundEnds)
        }
    }, [vmContract])

    useEffect(() => {
        getGameInfo()
    }, [vmContract, refresh])

    return (
        <GameContext.Provider
            value={{
                gameRound,
                roundEndsAt,
                balance,
                numOfPlayers,
                setNumOfPlayers,
                pickWinner,
                payWinner,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}