import { useContext } from "react"
import { ArrowRightCircle } from 'react-bootstrap-icons';
import { GameContext } from "./GameProvider";
import { Web3Context } from "./Web3Provider"

export function EnterPot() 
{
    let { web3, vmContract, address, doRefresh } = useContext(Web3Context)
    let { gameRound, roundEndsAt } = useContext(GameContext)

    const enterPotHandler = async() => {

        if (vmContract && address) {

            let remainingTime =  new Date(roundEndsAt * 1000) - Date.now();
            let remainingHours = remainingTime / (1000 * 3600);

            // we only recheck the remaining time on-chain on the last hour
            if (remainingHours < 1) {
                    const rounds = await vmContract.getPastEvents('RoundStarted', {
                    filter: {round: gameRound},
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                })
        
                if (rounds.length > 0) {
                    let round = rounds.filter(r => r.resultValues.round == gameRound)[0];
        
                    let remainingTime =  new Date(round.resultValues.endsAt * 1000) - Date.now();
                    if (remainingTime <= 0) {
                        alert('This round has already ended.\nPlease wait for the next round')
                        return false;
                    }
                }
            }

            try {
                await vmContract.methods.enter()
                    .send({
                        from: address,
                        value: web3.utils.toWei('0.1', 'ether')
                    })

                doRefresh()
            } catch(err) {
                console.log(err.message)
            }
        } else {
            alert('Please connect to wallet first')
        }
    }
    
    return (
        <button onClick={enterPotHandler}>Join the Pot <ArrowRightCircle size={25} /></button>
    )
}