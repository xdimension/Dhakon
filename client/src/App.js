import logo from "./logo.svg"
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"

import { Row, Col } from "react-bootstrap"
import { Web3Provider } from "./components/Web3Provider"
import { NavBar } from "./components/NavBar"
import { Banner } from "./components/Banner"
import { PickWinner } from "./components/PickWinner"
import { PayWinner } from "./components/PayWinner"
import { GameRound } from "./components/GameRound"
import { Balance } from "./components/Balance"
import { Players } from "./components/Players"
import { Winners } from "./components/Winners"
import { Stats } from "./components/Stats"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"

function App() {

  return (
    <Web3Provider>
      <div className="App">
        <NavBar />
        
        <Banner />

        <div style={{paddingTop:'50px', paddingBottom:'150px'}}>

          <div className="mt-2">
            <GameRound />
          </div>

          <div style={{marginTop:'20px'}}>
            <Balance />
          </div>


          <div style={{marginTop:'50px'}}>
            <PickWinner />
          </div>

          <div style={{marginTop:'20px'}}>
            <PayWinner />
          </div>

        </div>

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

        <Stats />
        <Contact />
        <Footer />
      </div>
    </Web3Provider>
  );
}

export default App;
