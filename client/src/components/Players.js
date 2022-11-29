import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { Web3Context } from "./Web3Provider";

export function Players() 
{
    let num = 1;
    let round = 1;

    let { vmContract, setNumOfPlayers, refresh } = useContext(Web3Context)
    
    const [players, setPlayers] = useState([])

    const getPlayers = async() => {
        if (vmContract) {
            const players = await vmContract.methods.getPlayers().call()
            setPlayers(players)
            setNumOfPlayers(players.length)
        }
    }

    useEffect(() => {
        getPlayers()
    }, [vmContract, refresh])

    return (
        <div className="players-bx wow slideInUp">

            <h2>Players</h2>
            <Table variant="dark" responsive="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th>Num#</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((address) => {
                        return (
                            <tr key={num++}>
                                <td>{num}</td>
                                <td>{truncateEthAddress(address)}</td>
                            </tr>
                        )
                    })}                           
                </tbody>
            </Table>
        </div>
    )
}