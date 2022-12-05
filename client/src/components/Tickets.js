import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { GameContext } from "./GameProvider";
import { Web3Context } from "./Web3Provider";

export function Tickets() 
{
    let num = 1;

    const { vmContract, refresh } = useContext(Web3Context)
    const { setNumOfEntries } = useContext(GameContext)
    
    const [tickets, setTickets] = useState([])

    const getTickets = async() => {
        if (vmContract) {
            let tickets = await vmContract.methods.getTickets(10).call()
            tickets = tickets.filter((ticket) => ticket.time != 0);
            const numOfTickets = await vmContract.methods.getNumOfTickets().call()
            
            setTickets(tickets)
            setNumOfEntries(numOfTickets)
        }
    }

    useEffect(() => {
        getTickets()
    }, [vmContract, refresh])

    return (
        <div className="players-bx wow slideInUp">

            <h2>Recent Entries</h2>
            <Table variant="dark" responsive="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Player</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => {
                        return (
                            <tr key={num++}>
                                <td>{(new Date(ticket.time * 1000)).toLocaleString()}</td>
                                <td>{truncateEthAddress(ticket.player)}</td>
                            </tr>
                        )
                    })}                           
                </tbody>
            </Table>
        </div>
    )
}