import { useContext, useState } from "react"
import { PiggyBank as EnterIcon, HourglassSplit as LoadingIcon} from 'react-bootstrap-icons'
import { GameContext } from "./GameProvider"
import { Web3Context } from "./Web3Provider"
import { toast } from "react-toastify"

export function EnterPot() 
{
    let { web3, networkId, vmContract, address, doRefresh } = useContext(Web3Context)
    let { config, numOfEntries, roundEndsAt } = useContext(GameContext)

    const [isLoading, setIsLoading]  = useState(false)

    const enterPotHandler = async() => {
        if (networkId && networkId != config.network.id) {
            toast.error(`Please connect to ${config.network.name} network to join`)
            return false;
        }

        if (!vmContract || !address) {
            toast.error('Please connect to wallet first')
            return false;
        }

        let remainingTime =  new Date(roundEndsAt * 1000) - Date.now();

        if (numOfEntries > 0 && remainingTime <= 0) {
            toast.error('This round has already ended. Please wait for the next round.')
            window.location.reload()
            return false;
        }

        try {
            setIsLoading(true)
            await vmContract.methods.enter()
                .send({
                    from: address,
                    value: web3.utils.toWei(config.ticketPrice.toString(), 'ether')
                })

            doRefresh()
        } catch(err) {
            console.log(err.message)
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <button onClick={enterPotHandler}>Join the Pot {isLoading? <LoadingIcon size={30} /> : <EnterIcon size={45} />}</button>
    )
}