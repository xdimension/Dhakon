import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"

import { Web3Provider } from "./components/Web3Provider"
import { NavBar } from "./components/NavBar"
import { Banner } from "./components/Banner"
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

        <Contact />
        <Footer />
      </div>
    </Web3Provider>
  );
}

export default App;
