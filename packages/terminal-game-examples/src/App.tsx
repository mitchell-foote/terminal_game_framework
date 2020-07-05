import React from 'react';
import './App.css';
import { GameWrapper } from 'react-terminal-game-builder';
import EscapeRoomEmails from './examples/escape-room-emails';
import MainStoryWrapper from './examples/remote-object-access';

let escapeRoomPrompt = `Escape Room Terminal: You've been trapped in a room, and you need the code to the room to escape. The code is located in the message server. The only login you have is for lferretti. Their password is 'password'. Good Luck!`
let satellitePrompt = `Remote satellite Terminal: We've gotten some odd readings from a satellite. It's your job to log into the satellite, determine the issues, and fix the satellite. Sat-Name is sat-1254, Sat-Access-Code is jbower-123.`

function App() {
  return (
    <div className="total-page terminal-background">
      <div className="terminal-title">
        {satellitePrompt}
      </div>
      <div className="terminal-holder">
        <GameWrapper startingComponent={MainStoryWrapper} />
      </div>
    </div>
  );
}

export default App;
