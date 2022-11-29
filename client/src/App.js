import logo from "./logo.svg"
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"

import { Web3Provider } from "./components/Web3Provider"
import { NavBar } from "./components/NavBar"
import { Banner } from "./components/Banner"
import { PickWinner } from "./components/PickWinner"
import { PayWinner } from "./components/PayWinner"
import { GameRound } from "./components/GameRound"
import { Stats } from "./components/Stats"
import { PlayersContainer } from "./components/PlayersContainer"
import { MailchimpForm } from "./components/MailchimpForm"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"

function App() {

  return (
    <Web3Provider>
      <div className="App">
        <NavBar />
        
        <Banner />

        <Stats />
        <PlayersContainer />
        <MailchimpForm /> 

        <div style={{paddingTop:'50px', paddingBottom:'150px'}}>

          <div className="mt-2">
            <GameRound />
          </div>

          <div style={{marginTop:'50px'}}>
            <PickWinner />
          </div>

          <div style={{marginTop:'20px'}}>
            <PayWinner />
          </div>

        </div>

        <Contact />
        <Footer />
      </div>
    </Web3Provider>
  );
}

export default App;
