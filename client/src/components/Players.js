import { useState, useContext, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";
import { Web3Context } from "./Web3Provider";

export function Players() 
{
    let num = 1;
    let round = 1;

    let { vmContract, refresh } = useContext(Web3Context)
    
    const [players, setPlayers] = useState([])
    const [winners, setWinners] = useState([])

    const getPlayers = async() => {
        if (vmContract) {
            const players = await vmContract.methods.getPlayers().call()
            setPlayers(players)
        }
    }

    const getWinners = async() => {
        if (vmContract) {
            const winners = await vmContract.methods.getWinners().call()
            setWinners(winners)
        }
    }

    useEffect(() => {
        getPlayers()
        getWinners()
    }, [vmContract, refresh])

    return (
        <section className="players" id="players">
            <div className="container">
                <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                                    <tr key={round++}>
                                        <td>{round}</td>
                                        <td>{truncateEthAddress(winner.player)}</td>
                                    </tr>
                                )
                            })}                           
                        </tbody>
                        </Table>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    )
}