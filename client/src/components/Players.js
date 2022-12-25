import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { GameContext } from "./GameProvider";
import { Web3Context } from "./Web3Provider";

export function Players() 
{
    let num = 1;

    const { networkId, vmContract, refresh } = useContext(Web3Context)
    const { config, setNumOfPlayers } = useContext(GameContext)
    
    const [players, setPlayers] = useState([])

    const getPlayers = async() => {
        if (vmContract && networkId == config.network.id) {
            let players = await vmContract.methods.getPlayers(10).call()
            players = players.filter((player) => player != 0);
            const numOfPlayers = await vmContract.methods.getNumOfPlayers().call()
            
            setPlayers(players)
            setNumOfPlayers(numOfPlayers)
        }
    }

    useEffect(() => {
        getPlayers()
    }, [vmContract, networkId, refresh])

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