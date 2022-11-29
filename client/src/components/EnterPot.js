import { useContext } from "react"
import { ArrowRightCircle } from 'react-bootstrap-icons';
import { Web3Context } from "./Web3Provider"

export function EnterPot() 
{
    let { web3, vmContract, address, doRefresh } = useContext(Web3Context)

    const enterPotHandler = async() => {
        if (vmContract) {
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