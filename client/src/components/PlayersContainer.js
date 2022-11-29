import { useContext } from "react"
import { Row, Col } from "react-bootstrap"
import { Web3Context } from "./Web3Provider"
import { Players } from "./Players"
import { Winners } from "./Winners"

export function PlayersContainer()
{
    const { address } = useContext(Web3Context)

    return (
        <section className="players" id="players">
            <div className="container">
                <Row>
                    <Col md={6}>
                        <Players />
                    </Col>
                    <Col md={6}>
                        <Winners />
                    </Col>
                </Row>
            </div>
        </section>
    )
}