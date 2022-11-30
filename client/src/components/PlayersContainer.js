import { Row, Col } from "react-bootstrap"
import { Players } from "./Players"
import { Winners } from "./Winners"

export function PlayersContainer()
{
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