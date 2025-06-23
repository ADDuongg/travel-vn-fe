// App.tsx
import React, { useEffect, useState } from 'react';
import ChatRoom from './components/ChatRoom';
import socketService from './service/socketService';
import DragLineTwoBox from './components/DragLineTwoBox';

function App() {
  const [roomId, setRoomId] = useState('room1');
  useEffect(() => {
    socketService.connect();
  }, []);
  return (
    <div
      style={{
        marginLeft: '10rem',
      }}
    >
      <h1>Realtime Room Chat</h1>
      <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
        <option value="room1">Phòng 1</option>
        <option value="room2">Phòng 2</option>
      </select>
      <ChatRoom roomId={roomId} />
      <DragLineTwoBox />
    </div>
  );
}

export default App;
