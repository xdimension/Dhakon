import { useContext } from "react"
import { Web3Context } from "./Web3Provider"

export function PayWinner() {
    let { vmContract, address, doRefresh } = useContext(Web3Context)

    const payWinner = async() => {
        console.log('paying Winner')
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

    return (
        <button style={{background:'red',color:'#FFF',padding:'20px'}} 
            onClick={payWinner}>
                <span>Pay Winner</span>
        </button>
    )
}