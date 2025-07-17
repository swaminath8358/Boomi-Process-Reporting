import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Custom hook for managing Socket.IO connections
 * Provides real-time communication with the backend
 */
export const useSocket = (options = {}) => {
  const { autoConnect = false, namespace = '' } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

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

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
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