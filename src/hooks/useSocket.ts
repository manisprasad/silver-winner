import { useEffect, useState } from 'react';

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const wss = new WebSocket("wss://chess-websocket-vi9b.onrender.com");
        wss.onopen = () => {
            console.log("WebSocket connection opened");
            setSocket(wss);
        }

        wss.onclose = () => {
            console.log("WebSocket connection closed");
            setSocket(null);
        };

        return () => {
            wss.close();
        }
    }, [])
    return socket;
}
