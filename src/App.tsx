// App.tsx
import React, { useEffect, useState } from 'react';
import ChatRoom from './components/ChatRoom';
import socketService from './service/socketService';
import DragLineTwoBox from './components/DragLineTwoBox';
import { useTranslation } from 'react-i18next';

function App() {
  const [roomId, setRoomId] = useState('room1');
  const { t, i18n } = useTranslation();
  useEffect(() => {
    socketService.connect();
  }, []);
  return (
    <div
      style={{
        marginLeft: '10rem',
      }}
    >
      <h1>{t('greeting')}</h1>
      <button onClick={() => i18n.changeLanguage('vi')}>Tiếng Việt</button>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
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
