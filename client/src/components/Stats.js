import { Row, Col } from "react-bootstrap";
import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import colorSharp from "../assets/img/color-sharp.png"
import { MailchimpForm } from "./MailchimpForm";

export const Stats = () => {
  return (
    <section className="stat" id="stats">
        <div className="container">
            <Row>
                <Col>
                    <div className="stat-bx wow zoomIn">
                        <h2>Statistic</h2>
                        <p>Don't be left behind, take your chance and collect your Lucky Pot.</p>
                          <Row>
                              <Col className="item" sm={12} md={4}>
                                  <img src={meter1} alt="Image" />
                                  <h5>Web Development</h5>
                              </Col>
                              <Col className="item" sm={12} md={4}>
                                  <img src={meter2} alt="Image" />
                                  <h5>Brand Identity</h5>
                              </Col>
                              <Col className="item" sm={12} md={4}>
                                  <img src={meter3} alt="Image" />
                                  <h5>Logo Design</h5>
                              </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <MailchimpForm /> 
        </div>
        <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  )
}
