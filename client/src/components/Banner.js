import { Container, Row, Col } from "react-bootstrap"
import TrackVisibility from 'react-on-screen'
import headerImg from "../assets/img/piggybank.png"
import { EnterPot } from "./EnterPot"
import 'animate.css'

export const Banner = () => {

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <span className="tagline">Welcome to CrowdPot</span>
                <h1>{`Hi! Is Today Your Luckiest Day?`}</h1>
                <h5 className="mt-4">You have a chance to WIN the JACKPOT with only a small bid!</h5>
                
                <EnterPot />
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={headerImg} alt="Header Img"/>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
