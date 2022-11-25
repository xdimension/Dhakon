import { useContext } from "react"
import { Web3Context } from "./Web3Provider"

export function EnterPot() 
{
    let { web3, vmContract, address, doRefresh } = useContext(Web3Context)

    const enterPotHandler = async() => {
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
    }
    
    return (
        <button style={{background:'red',color:'#FFF',padding:'20px'}} 
          onClick={enterPotHandler}><span>Join Pot</span>
        </button>
    )
}