import React from 'react';
import './App.css';
import { GameWrapper } from 'react-terminal-game-builder'
import { BrowserRouter, Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import EscapeRoomEmails from './examples/escape-room-emails';
import MainStoryWrapper from './examples/remote-object-access';
// import ReactPlayer from 'react-player';
// import Video from './examples/security-room-terminal/media/stock-movie.mov';
// import MountainImage from './examples/security-room-terminal/media/mountain.jpg'
import MainStorySecurityTerminal from './examples/security-room-terminal';
import ShieldTakedownMainComponent from './examples/shield-takedown';
import ReactorControlFullComponent from './examples/reactor-overload/full-wrapped'
import VirusHackingWrapped from './examples/hack-o-matic/full-wrapper';
import ComputerRepairWrapped from './examples/computer-restore/full-wrapped';

/**
 * Ideas
 * 
 * Starting page to load up the different stations
 * Reactor Overload (Start/Stop an overload) (DONE)
 * Forcefield Takedown ()
 *  - Guess a frequency
 * Computer Restore (DONE)
 *  - 
 * Download/Transmit Files ()
 *  - 
 * Virus Infection (DONE)
 */

let escapeRoomPrompt = `Escape Room Terminal: You've been trapped in a room, and you need the code to the room to escape. The code is located in the message server. The only login you have is for lferretti. Their password is 'password'. Good Luck!`
let satellitePrompt = `Remote satellite Terminal: We've gotten some odd readings from a satellite. It's your job to log into the satellite, determine the issues, and fix the satellite. Sat-Name is sat-1254, Sat-Access-Code is jbower-123.`
let securityTerminalPrompt = `You've reached a security terminal: You've been able to steal one set of login creds: 'door-control' with password 'lock3r'. Your mission is to shut the entire network down`
interface AppProps {

}

interface AppState {
  escapeRoomState: any
  sateliteState: any
  securityState: any
  shieldState: any
  reactorState: any
}

class App extends React.Component<AppProps, AppState> {
  state: AppState = { reactorState: {}, escapeRoomState: {}, sateliteState: {}, securityState: {}, shieldState: {} }

  render() {
    return (<BrowserRouter>
      <Route exact path="/" render={(routeProps) => {
        return (
          <div className='total-page terminal-background'>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => {
                  routeProps.history.push('/satelite')
                }}>Satelite Takedown</button>
                <button onClick={() => routeProps.history.push('/shield')}>
                  Shield Takedown
                </button>
                <button onClick={() => routeProps.history.push('/message')}>
                  Message Mission
                </button>
                <button onClick={() => routeProps.history.push('/security')}>
                  Security Station
                </button>
                <button onClick={() => routeProps.history.push('/hackingsys')}>
                  Default Offensive Virus Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=yes&restore=yes')}>
                  Default Computer
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => routeProps.history.push('/reactor?overload=true&ship_name=USS%20Odyssey&reactor_name=Warp%20Reactor')}>
                  ODY Reactor Overload
                </button>
                <button onClick={() => routeProps.history.push('/reactor?ship_name=USS%20Odyssey&reactor_name=Warp%20Reactor')}>
                  ODY Reactor Restart
                </button>
                <button onClick={() => routeProps.history.push('/hackingsys?system_name=C.O.R.O.N.A.%20Eclipse%20System&target_name=Darksky')}>
                  ODY Offensive Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?restore=yes&system_name=C.O.R.O.N.A.%20Restore%20System&restore_system=C.O.R.O.N.A.')}>
                  ODY Corona Restore
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=C.O.R.O.N.A.%20Backup%20System&destinations=admin-process-221,darksky-sniffer-11,dev-null,port://98733')}>
                  ODY Corona Backup System
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pirate%20Backup%20System&destinations=corona-proc-1,darksky-sniffer-11,dev-null,port://91733')}>
                  When you need to transfer a backup to the ODY from Pirates
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => routeProps.history.push('/reactor?overload=true&ship_name=USS%20Pheonix&reactor_name=Fusion%20Reactor')}>
                  PHX Reactor Overload
                </button>
                <button onClick={() => routeProps.history.push('/reactor?ship_name=USS%20Pheonix&reactor_name=Fusion%20Reactor')}>
                  PHX Reactor Restart
                </button>
                <button onClick={() => routeProps.history.push('/hackingsys?system_name=Pheonix%20Experimental%20Intrusion%20System&target_name=Darksky')}>
                  PHX Offensive Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?restore=yes&system_name=Pheonix%20Restore%20System&restore_system=Main%20Computer%20System')}>
                  PHX Computer Restore
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pheonix%20Backup%20System&destinations=admin-process-221,dev-null,port://98733')}>
                  PHX Computer Backup System
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pirate%20Backup%20System&destinations=pheonix-proc-1,darksky-sniffer-11,dev-null,port://91733')}>
                  When you need to transfer a backup to the PHX from Pirates
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => routeProps.history.push('/reactor?overload=true&ship_name=USS%20Magellan&reactor_name=Warp%20Reactor')}>
                  MAG Reactor Overload
                </button>
                <button onClick={() => routeProps.history.push('/reactor?ship_name=USS%20Magellan&reactor_name=Warp%20Reactor')}>
                  MAG Reactor Restart
                </button>
                <button onClick={() => routeProps.history.push('/hackingsys?system_name=Magellan%20Intrusion%20System&target_name=Darksky')}>
                  MAG Offensive Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?restore=yes&system_name=Magellan%20Restore%20System&restore_system=Main%20Computer%20System')}>
                  MAG Computer Restore
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Magellan%20Backup%20System&destinations=admin-process-221,dev-null,port://98733')}>
                  MAG Computer Backup System
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pirate%20Backup%20System&destinations=magellan-proc-1,darksky-sniffer-11,dev-null,port://91733')}>
                  When you need to transfer a backup to the MAG from Pirates
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => routeProps.history.push('/reactor?overload=true&ship_name=USS%20Cassini&reactor_name=Warp%20Reactor')}>
                  CAS Reactor Overload
                </button>
                <button onClick={() => routeProps.history.push('/reactor?ship_name=USS%20Cassini&reactor_name=Warp%20Reactor')}>
                  CAS Reactor Restart
                </button>
                <button onClick={() => routeProps.history.push('/hackingsys?system_name=Cassini%20Intrusion%20System&target_name=Darksky')}>
                  CAS Offensive Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?restore=yes&system_name=Cassini%20Restore%20System&restore_system=Main%20Computer%20System')}>
                  CAS Computer Restore
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Cassini%20Backup%20System&destinations=admin-process-221,dev-null,port://98733')}>
                  CAS Computer Backup System
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pirate%20Backup%20System&destinations=cassini-proc-1,darksky-sniffer-11,dev-null,port://91733')}>
                  When you need to transfer a backup to the CAS from Pirates
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => routeProps.history.push('/hackingsys?system_name=Starfleet%20Intelligence%20Intrusion%20System&target_name=Darksky')}>
                  GAL (Remote) Offensive Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?restore=yes&system_name=Starfleet%20Intelligence%20Restore%20System&restore_system=Main%20Computer%20System')}>
                  GAL Computer Restore
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Starfleet%20Intelligence%20Backup%20System&destinations=admin-process-221,dev-null,port://98733')}>
                  GAL Computer Backup System
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pirate%20Backup%20System&destinations=galileo-proc-1,darksky-sniffer-11,dev-null,port://91733')}>
                  When you need to transfer a backup to the GAL from Pirates
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => routeProps.history.push('/reactor?overload=true&ship_name=Falcon&reactor_name=Warp%20Reactor')}>
                  FAL Reactor Overload
                </button>
                <button onClick={() => routeProps.history.push('/reactor?ship_name=Falcon&reactor_name=Warp%20Reactor')}>
                  FAL Reactor Restart
                </button>
                <button onClick={() => routeProps.history.push('/hackingsys?system_name=Not%20Stolen%20Starfleet%20Intrusion%20System&target_name=Darksky')}>
                  FAL Offensive Hacking
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?restore=yes&system_name=Falcon%20Restore%20System&restore_system=Main%20Computer%20System')}>
                  FAL Computer Restore
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Falcon%20Backup%20System&destinations=admin-process-221,dev-null,port://98733')}>
                  FAL Computer Backup System
                </button>
                <button onClick={() => routeProps.history.push('/computer-restore?backups=true&system_name=Pirate%20Backup%20System&destinations=falcon-proc-1,darksky-sniffer-11,dev-null,port://91733')}>
                  When you need to transfer a backup to the FAL from Pirates
                </button>
              </div>
            </div>
          </div>
        )
      }}>


      </Route>
      <Route path={`/hackingsys`}>
        <VirusHackingWrapped />
      </Route>
      <Route path="/satelite">
        <div className="total-page terminal-background">
          <Link to="/message">To Message</Link>
          <div className="terminal-title">
            {satellitePrompt}
          </div>
          <div className="terminal-holder">
            <GameWrapper overallState={this.state.sateliteState} onUpdateExternalState={(state, callback) => { this.setState({ sateliteState: state }, callback) }} startingComponent={MainStoryWrapper} />
          </div>
        </div>
      </Route>
      <Route path="/message">
        <div className="total-page terminal-background">
          <Link to="/">To Remote Access</Link>
          <div className="terminal-title">
            {escapeRoomPrompt}
          </div>
          <div className="terminal-holder">
            <GameWrapper overallState={this.state.escapeRoomState} onUpdateExternalState={(state, callback) => { this.setState({ escapeRoomState: state }, callback) }} startingComponent={EscapeRoomEmails} />
          </div>
        </div>
      </Route>
      <Route path="/security">
        <div className="total-page terminal-background">
          <Link to="/">To Remote Access</Link>
          <div className="terminal-title">
            {securityTerminalPrompt}
          </div>
          <div className="terminal-holder">
            <GameWrapper overallState={this.state.escapeRoomState} onUpdateExternalState={(state, callback) => { this.setState({ escapeRoomState: state }, callback) }} startingComponent={MainStorySecurityTerminal} />
          </div>
        </div>
      </Route>
      <Route path="/reactor">
        <ReactorControlFullComponent />
      </Route>
      <Route path="/test">
        <div className='total-page terminal-background'>
          <div className='terminal-holder'>
            {/* <img style={{ height: '100%', width: '100%' }} src={MountainImage} /> */}
            {/* <ReactPlayer loop={true} height={'100%'} width={"100%"} playing={true} muted={true} url={MountainImage} /> */}
          </div>
        </div>
      </Route>
      <Route path={`/computer-restore`}>
        <ComputerRepairWrapped />
      </Route>
      <Route path={"/shield"}>
        <div className="total-page terminal-background">
          <Link to="/">To Remote Access</Link>
          <div className="terminal-title">
            {"this is cool fancy green text!"}
          </div>
          <div className="terminal-holder">
            <GameWrapper overallState={this.state.shieldState} onUpdateExternalState={(state, callback) => { this.setState({ shieldState: state }, callback) }} startingComponent={ShieldTakedownMainComponent} />
          </div>
        </div>
      </Route>
    </BrowserRouter>);
  }
}

export default App;
