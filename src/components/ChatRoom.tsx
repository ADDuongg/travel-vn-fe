import React, { useState, useEffect, useCallback } from 'react';
import socketService from '../lib/socket';

type Message = {
  sender: string;
  text: string;
};

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socketService.emit('join-room', roomId);
    socketService.on('notification', handleNotification);
    socketService.on('message', handleMessage);
    return () => {
      socketService.emit('leave-room', roomId);
      socketService.off('notification', handleNotification);
      socketService.off('message', handleMessage);
      setMessages([]);
    };
  }, [roomId]);

  const handleMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleNotification = useCallback((note: string) => {
    setMessages((prev) => [...prev, { sender: 'SYSTEM', text: note }]);
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      socketService.emit('message', { roomId, message: input });
      setInput('');
    }
  };

  return (
    <div>
      <h2>Phòng: {roomId}</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 8,
          height: 200,
          overflowY: 'auto',
          marginBottom: 8,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.sender === 'SYSTEM' ? '🟢' : msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Gửi</button>
    </div>
  );
};

export default ChatRoom;

