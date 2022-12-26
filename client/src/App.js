import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"

import { Web3Provider } from "./components/Web3Provider"
import { StatusBar } from "./components/StatusBar"
import { NavBar } from "./components/NavBar"
import { Banner } from "./components/Banner"
import { Stats } from "./components/Stats"
import { EntriesContainer } from "./components/EntriesContainer"
import { MailchimpForm } from "./components/MailchimpForm"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"
import { GameProvider } from "./components/GameProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useMediaQuery } from 'react-responsive'

function App() {

  const isOnWideDisplay = useMediaQuery({ query: '(min-width:800px)' });
  const width = isOnWideDisplay ? '40%' : '100%';

  return (
    <>
      <Web3Provider>
        <GameProvider>
          <div className="App">
            <StatusBar />
            <section className="outer-wrapper">
              <NavBar />
              <Banner />

              <Stats />
              <EntriesContainer />
              <MailchimpForm /> 

              <Contact />
              <Footer />
            </section>
          </div>
        </GameProvider>
      </Web3Provider>

      <ToastContainer theme="colored" position='top-center' hideProgressBar style={{width}} />
    </>
  );
}

export default App;
