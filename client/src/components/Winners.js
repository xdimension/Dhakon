import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { Web3Context } from "./Web3Provider";

export function Winners() 
{
    const { vmContract, refresh } = useContext(Web3Context)
    
    const [winners, setWinners] = useState([])

    const getWinners = async() => {
        if (vmContract) {
            let winners = await vmContract.methods.getWinners(10).call()
            winners = winners.filter((winner) => winner.ticket != 0);
            setWinners(winners)
        }
    }

    useEffect(() => {
        getWinners()
    }, [vmContract, refresh])

    return (
        <div className="players-bx wow slideInUp">

            <h2>Winners</h2>
            <Table variant="dark" responsive="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {winners.map((winner) => {
                        return (
                            <tr key={winner.round}>
                                <td>{winner.round}</td>
                                <td>{truncateEthAddress(winner.player)}</td>
                            </tr>
                        )
                    })}                           
                </tbody>
            </Table>
        </div>
    )
}