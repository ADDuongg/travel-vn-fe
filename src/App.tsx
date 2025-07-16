// App.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChatRoom from './components/ChatRoom';
import DragLineTwoBox from './components/DragLineTwoBox';
import { Button } from './components/ui/button';
import socketService from './lib/socket';
import { ModeToggle } from './components/mode-toggle';

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
      <ModeToggle />
      <h1 className="text-3xl font-bold underline text-red-400">
        {t('greeting')}
      </h1>
      <Button onClick={() => i18n.changeLanguage('vi')}>Tiếng Việt</Button>
      <Button onClick={() => i18n.changeLanguage('en')}>English</Button>
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
