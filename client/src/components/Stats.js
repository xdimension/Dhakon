import { useContext, useState, useEffect, useCallback } from "react"
import { Row, Col } from "react-bootstrap"
import TrackVisibility from "react-on-screen"
import colorSharp from "../assets/img/color-sharp.png"
import CountUp from "react-countup"
import CountDown from "react-countdown"
import { zeroPad } from "react-countdown"
import { GameContext } from "./GameProvider"

export function Stats() 
{
    const { balance, gameRound, roundEndsAt, numOfEntries } = useContext(GameContext)

    let [roundEnds, setRoundEnds] = useState(0)
    let [remainingTime, setRemainingTime] = useState(0)
    let [remainingDays, setRemainingDays] = useState(0)

    const renderer = ({
        formatted: { hours, minutes, seconds }
    }) => (
        <span>
          {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
    )

    useEffect(() => {
        if (roundEndsAt > 0) {
            let roundEnds = roundEndsAt * 1000;
            setRoundEnds(roundEnds);

            remainingTime =  new Date(roundEnds) - Date.now();
            setRemainingTime(remainingTime)
            setRemainingDays(parseInt(remainingTime / (1000 * 3600 * 24)));
        }
    }, [roundEndsAt])

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
                                        <h5>Remaining Time</h5>
                                        <span className="counter">
                                        {
                                            remainingTime > (1000 * 3600 * 24)?
                                            <CountUp start={roundEndsAt>0? 90: 0} end={remainingDays} duration={3} formattingFn={num => (num>1? `${num} Days` : `${num} Day`)} /> :
                                            <CountDown daysInHours key={roundEnds} date={roundEnds} renderer={renderer} /> 
                                        }
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
