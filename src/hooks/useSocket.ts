import { useEffect } from 'react';
import socketService from '../lib/socket';

type SocketEvent = string;
type Handler = (...args: any[]) => void;

const useSocket = (event: SocketEvent, handler: Handler) => {
  useEffect(() => {
    socketService.connect();
    socketService.on(event, handler);

    return () => {
      socketService.off(event, handler);
    };
  }, [event, handler]);
};

export default useSocket;

