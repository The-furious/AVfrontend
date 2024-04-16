import React, { useEffect } from 'react';
import WebSocketClient from 'websocket';

const WebSocketComponent = () => {
  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocketClient('ws://example.com/socket');

    // Event handler for WebSocket open
    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    // Event handler for WebSocket messages
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    // Event handler for WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Event handler for WebSocket close
    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Cleanup function to close WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Component</h1>
      {/* Add your component content here */}
    </div>
  );
};

export default WebSocketComponent;
