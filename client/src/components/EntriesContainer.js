import { Row, Col } from "react-bootstrap"
import { Tickets } from "./Tickets"
import { Winners } from "./Winners"

export function EntriesContainer()
{
    return (
        <section className="players" id="players">
            <div className="container">
                <Row>
                    <Col md={6}>
                        <Tickets />
                    </Col>
                    <Col md={6}>
                        <Winners />
                    </Col>
                </Row>
            </div>
        </section>
    )
}