import { useContext } from "react"
import { ArrowRightCircle } from 'react-bootstrap-icons'
import { GameContext } from "./GameProvider"
import { Web3Context } from "./Web3Provider"

export function EnterPot() 
{
    let { web3, vmContract, address, doRefresh } = useContext(Web3Context)
    let { config, numOfEntries, roundEndsAt } = useContext(GameContext)

    const enterPotHandler = async() => {

        if (vmContract && address) {

            let remainingTime =  new Date(roundEndsAt * 1000) - Date.now();

            if (numOfEntries > 0 && remainingTime <= 0) {
                alert('This round has already ended.\nPlease wait for the next round')
                window.location.reload()
                return false;
            }

            try {
                await vmContract.methods.enter()
                    .send({
                        from: address,
                        value: web3.utils.toWei(config.ticketPrice.toString(), config.currency.unit)
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