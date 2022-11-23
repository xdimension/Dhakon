import { Col, Row, Table } from "react-bootstrap";
import truncateEthAddress from "truncate-eth-address";

export const Players = (props) => {
    let num = 1;
    let round = 1;
    let { players, winners } = props;
    
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