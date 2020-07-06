import React from 'react';
import './App.css';
import { GameWrapper } from 'react-terminal-game-builder';
import { BrowserRouter, Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import EscapeRoomEmails from './examples/escape-room-emails';
import MainStoryWrapper from './examples/remote-object-access';

let escapeRoomPrompt = `Escape Room Terminal: You've been trapped in a room, and you need the code to the room to escape. The code is located in the message server. The only login you have is for lferretti. Their password is 'password'. Good Luck!`
let satellitePrompt = `Remote satellite Terminal: We've gotten some odd readings from a satellite. It's your job to log into the satellite, determine the issues, and fix the satellite. Sat-Name is sat-1254, Sat-Access-Code is jbower-123.`

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/">
        <div className="total-page terminal-background">
          <Link to="/message">To Message</Link>
          <div className="terminal-title">
            {satellitePrompt}
          </div>
          <div className="terminal-holder">
            <GameWrapper startingComponent={MainStoryWrapper} />
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
            <GameWrapper startingComponent={EscapeRoomEmails} />
          </div>
        </div>
      </Route>
    </BrowserRouter>

  );
}

export default App;
