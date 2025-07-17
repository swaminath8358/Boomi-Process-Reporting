import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types';

interface UseSocketOptions {
  autoConnect?: boolean;
  namespace?: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: <K extends keyof SocketEvents>(event: K, callback: (data: SocketEvents[K]) => void) => void;
  off: (event: string, callback?: Function) => void;
}

/**
 * Custom hook for managing Socket.IO connections
 * Provides real-time communication with the backend
 */
export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
  const { autoConnect = false, namespace = '' } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    if (socketRef.current?.connected) return;

    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('boomi-dashboard-token');

    socketRef.current = io(serverUrl + namespace, {
      auth: {
        token,
      },
      autoConnect: false,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
      setIsConnected(true);
      
      // Join dashboard room for real-time updates
      socketRef.current?.emit('join-dashboard');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current.connect();
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = <K extends keyof SocketEvents>(
    event: K,
    callback: (data: SocketEvents[K]) => void
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event as string, callback);
    }
  };

  const off = (event: string, callback?: Function) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};