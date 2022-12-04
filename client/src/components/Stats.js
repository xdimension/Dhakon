import { useContext } from "react"
import { Row, Col } from "react-bootstrap"
import TrackVisibility from "react-on-screen"
import colorSharp from "../assets/img/color-sharp.png"
import CountUp from "react-countup"
import { GameContext } from "./GameProvider"

export function Stats() 
{
    const { balance, gameRound, roundEndsAt, numOfEntries } = useContext(GameContext)

    let startingDays = 0;
    let remainingDays = 0;

    if (roundEndsAt > 0) {
        startingDays = 90;
        remainingDays =  parseInt((new Date(roundEndsAt * 1000) - (new Date()))  / (1000 * 3600 * 24));
    }

    return (
        <section className="stat" id="stats">
            <div className="container">
                <Row>
                    <Col>
                        <div className="stat-bx wow zoomIn">
                            <h2>{gameRound? `Round: ${gameRound}` : 'Statistic'}</h2>
                            <p>Don't be left behind, take your chance and collect your Lucky Pot.</p>
                            
                            <TrackVisibility once={true}>
                                {({ isVisible }) => (isVisible &&
                                <Row>
                                    <Col className="item" sm={12} md={4}>
                                        <h5>In the Pot</h5>
                                        <span className="counter">
                                            <CountUp end={balance} decimals={2} duration={2} /> ETH
                                        </span>
                                    </Col>
                                    <Col className="item" sm={12} md={4}>
                                        <h5>Entries</h5>
                                        <span className="counter">
                                            <CountUp end={numOfEntries} duration={3} />
                                        </span>
                                    </Col>
                                    <Col className="item" sm={12} md={4}>
                                        <h5>Remaining Days</h5>
                                        <span className="counter">
                                            <CountUp start={startingDays} end={remainingDays} duration={3} />
                                        </span>
                                    </Col>
                                </Row>)}
                            </TrackVisibility>
                        </div>
                    </Col>
                </Row>
            </div>

            <img className="background-image-left" src={colorSharp} alt="Image" />
        </section>
    )
}
