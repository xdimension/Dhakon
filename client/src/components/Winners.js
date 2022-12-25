import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { Web3Context } from "./Web3Provider";
import { GameContext } from "./GameProvider";
import viewTrxIcon from '../assets/img/view-trx-icon.svg'

export function Winners() 
{
    const { networkId, vmContract, refresh } = useContext(Web3Context)
    const { config } = useContext(GameContext)
    
    const [winners, setWinners] = useState([])
    const [trx, setTrx] = useState([])

    const getWinners = async() => {
        if (vmContract && networkId == config.network.id) {
            let winners = await vmContract.methods.getWinners(10).call()
            winners = winners.filter((winner) => winner.ticket != 0);
            setWinners(winners)
        }
    }

    const getTrx = async (ticketNums) => {
        if (vmContract && networkId == config.network.id) {
            let trx = await vmContract.getPastEvents('WinnerChosen', {
                filter: { ticket: ticketNums },
                fromBlock: 0,
                toBlock: 'latest'
            })

            setTrx(trx)
        }
    } 

    useEffect(() => {
        getWinners()
    }, [vmContract, networkId, refresh])

    useEffect(() => {
        getTrx(winners.map(t => t.ticket))
    }, [vmContract, winners, refresh])

    return (
        <div className="players-bx wow slideInUp">

            <h2>Winners</h2>
            <Table variant="dark" responsive="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {winners.map((winner) => {
                        let trx1 = trx.filter((trx) => trx.returnValues.ticket == winner.ticket);
                        let trxHash = trx1[0]? trx1[0].transactionHash : '';

                        return (
                            <tr key={winner.round}>
                                <td>{winner.round}</td>
                                <td>{truncateEthAddress(winner.player)}</td>
                                <td>
                                    <a className="view-trx" href={config.token.explorerUrl+trxHash} target='_blank'>
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