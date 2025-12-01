import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(token) {
        if (this.socket?.connected) {
            console.log('Socket already connected:', this.socket.id);
            return Promise.resolve(this.socket);
        }

        const SOCKET_URL = import.meta.env.VITE_API_URL;
        console.log('Connecting to socket:', SOCKET_URL);
        console.log('Using token:', token ? 'Token present' : 'NO TOKEN!');

        this.socket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Socket connection timeout'));
            }, 10000);

            this.socket.on('connect', () => {
                clearTimeout(timeout);
                console.log('Socket connected:', this.socket.id);
                this.connected = true;
                resolve(this.socket);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                this.connected = false;
            });

            this.socket.on('connect_error', (error) => {
                clearTimeout(timeout);
                console.error('Socket connection error:', error.message);
                reject(error);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    joinRoom(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('joinRoom', roomId);
            console.log('Joined room:', roomId);
        }
    }

    leaveRoom(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('leaveRoom', roomId);
            console.log('Left room:', roomId);
        }
    }

    sendMessage(roomId, text) {
        if (this.socket?.connected) {
            this.socket.emit('sendMessage', { roomId, text });
        }
    }

    onNewMessage(callback) {
        if (this.socket) {
            this.socket.on('newMessage', callback);
        }
    }

    offNewMessage(callback) {
        if (this.socket) {
            this.socket.off('newMessage', callback);
        }
    }

    markSeen(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('markSeen', roomId);
        }
    }

    onMessagesSeen(callback) {
        if (this.socket) {
            this.socket.on('messagesSeen', callback);
        }
    }

    offMessagesSeen(callback) {
        if (this.socket) {
            this.socket.off('messagesSeen', callback);
        }
    }

    emitTyping(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('typing', roomId);
        }
    }

    emitStopTyping(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('stopTyping', roomId);
        }
    }

    onTyping(callback) {
        if (this.socket) {
            this.socket.on('typing', callback);
        }
    }

    offTyping(callback) {
        if (this.socket) {
            this.socket.off('typing', callback);
        }
    }

    onStopTyping(callback) {
        if (this.socket) {
            this.socket.on('stopTyping', callback);
        }
    }

    offStopTyping(callback) {
        if (this.socket) {
            this.socket.off('stopTyping', callback);
        }
    }

    onChatClosed(callback) {
        if (this.socket) {
            this.socket.on('chatClosed', callback);
        }
    }

    offChatClosed(callback) {
        if (this.socket) {
            this.socket.off('chatClosed', callback);
        }
    }

    isConnected() {
        return this.connected && this.socket?.connected;
    }
}

// Export a singleton instance
const socketService = new SocketService();
export default socketService;
