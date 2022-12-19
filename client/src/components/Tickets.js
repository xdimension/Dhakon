import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { GameContext } from "./GameProvider";
import { Web3Context } from "./Web3Provider";
import viewTrxIcon from '../assets/img/view-trx-icon.svg'

export function Tickets() 
{
    const TRX_EXPLORER_LINK = process.env.REACT_APP_TRX_EXPLORER_LINK;

    let num = 1;

    const { vmContract, refresh } = useContext(Web3Context)
    const { setNumOfEntries } = useContext(GameContext)
    
    const [tickets, setTickets] = useState([])
    const [trx, setTrx] = useState([])

    const getTickets = async() => {
        if (vmContract) {
            let tickets = await vmContract.methods.getTickets(10).call()
            tickets = tickets.filter((ticket) => ticket.time != 0);
            const numOfTickets = await vmContract.methods.getNumOfTickets().call()
            
            setTickets(tickets)
            setNumOfEntries(numOfTickets)
        }
    }

    const getTrx = async (ticketNums) => {
        if (vmContract) {
            let trx = await vmContract.getPastEvents('NewPlayerEntered', {
                filter: { ticket: ticketNums },
                fromBlock: 0,
                toBlock: 'latest'
            })

            setTrx(trx)
        }
    } 

    useEffect(() => {
        getTickets()
    }, [vmContract, refresh])

    useEffect(() => {
        getTrx(tickets.map(t => t.num))
    }, [vmContract, tickets, refresh])

    return (
        <div className="players-bx wow slideInUp">

            <h2>Recent Entries</h2>
            <Table variant="dark" responsive="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Player</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => {
                        let trx1 = trx.filter((trx) => trx.returnValues.ticket == ticket.num);
                        let trxHash = trx1[0]? trx1[0].transactionHash : '';
                        
                        return (
                            <tr key={num++}>
                                <td>{(new Date(ticket.time * 1000)).toLocaleString()}</td>
                                <td>{truncateEthAddress(ticket.player)}</td>
                                <td>
                                    <a className="view-trx" href={TRX_EXPLORER_LINK+trxHash} target='_blank'>
                                        <img src={viewTrxIcon} alt="" />
                                    </a>
                                </td>
                            </tr>
                        )
                    })}                           
                </tbody>
            </Table>
        </div>
    )
}