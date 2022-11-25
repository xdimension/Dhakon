import { useContext } from "react"
import { Web3Context } from "./Web3Provider"

export function PickWinner() {
    let { vmContract, address, doRefresh } = useContext(Web3Context)

    const pickWinner = async() => {
        console.log('picking Winner')
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

    return (
        <button style={{background:'orange',color:'#FFF',padding:'20px'}} 
             onClick={pickWinner}>
                <span>Pick Winner</span>
        </button>
    )
}