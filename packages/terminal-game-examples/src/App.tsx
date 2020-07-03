import React from 'react';
import './App.css';
import { GameWrapper } from 'react-terminal-game-builder';
import EscapeRoomEmails from './examples/escape-room-emails';

function App() {
  return (
    <div className="total-page terminal-background">
      <div className="terminal-title">
        Escape Room Terminal: You've been trapped in a room, and you need the code to the room to escape. The code is located in the message server. The only login you have is for lferretti. Their password is 'password'. Good Luck!
      </div>
      <div className="terminal-holder">
        <GameWrapper startingComponent={EscapeRoomEmails} />
      </div>
    </div>
  );
}

export default App;
