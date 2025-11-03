import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Bot, User, Clock, CheckCheck } from 'lucide-react';
import ApiService from '../../../services/apiService';
import socketService from '../../../services/socketService';

const CandidateChat = ({ roomId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [smartReplies, setSmartReplies] = useState([]);
  const [showSmartReplies, setShowSmartReplies] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const response = await ApiService.getChatMessages(roomId, pageNum, 20);
      
      if (pageNum === 1) {
        setMessages(response.messages || []);
        setRoomInfo(response.room);
      } else if (append) {
        setMessages(prev => [...(response.messages || []), ...prev]);
      }
      
      setHasMore((response.messages || []).length === 20);
      
      if (pageNum === 1) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      // Send via Socket.IO for real-time delivery
      socketService.sendMessage(roomId, newMessage.trim());
      setNewMessage('');
      setSmartReplies([]);
      setShowSmartReplies(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleSmartReply = async (lastRecruiterMessage) => {
    try {
      setLoading(true);
      const response = await ApiService.getSmartReplies(lastRecruiterMessage._id);
      
      if (Array.isArray(response.replies)) {
        setSmartReplies(response.replies);
        setShowSmartReplies(true);
      } else {
        // Handle ethical warning
        alert(response.replies?.[0] || 'Smart replies not available for this message type.');
      }
    } catch (error) {
      console.error('Error getting smart replies:', error);
      alert('Smart replies temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const useSmartReply = (reply) => {
    setNewMessage(reply);
    setShowSmartReplies(false);
    setSmartReplies([]);
  };

  const markAsSeen = async () => {
    try {
      await ApiService.markMessagesAsSeen(roomId);
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchMessages(nextPage, true);
  };

  useEffect(() => {
    if (roomId) {
      // Initial fetch
      fetchMessages(1);
      markAsSeen();
      
      // Connect socket
      const token = localStorage.getItem('authToken');
      socketService.connect(token);
      socketService.joinRoom(roomId);
      
      // Listen for new messages
      const handleNewMessage = (message) => {
        console.log('📨 Real-time message received:', message);
        setMessages(prev => [...prev, message]);
        setTimeout(scrollToBottom, 100);
        socketService.markSeen(roomId);
      };
      
      // Listen for messages seen
      const handleMessagesSeen = ({ roomId: seenRoomId }) => {
        if (seenRoomId === roomId) {
          setMessages(prev => prev.map(msg => ({ ...msg, isSeen: true })));
        }
      };
      
      socketService.onNewMessage(handleNewMessage);
      socketService.onMessagesSeen(handleMessagesSeen);
      
      // Cleanup
      return () => {
        socketService.offNewMessage(handleNewMessage);
        socketService.offMessagesSeen(handleMessagesSeen);
      };
    }
  }, [roomId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getLastRecruiterMessage = () => {
    return messages
      .slice()
      .reverse()
      .find(msg => msg.senderRole === 'Recruiter');
  };

  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {roomInfo?.recruiter?.fullName || 'Recruiter'}
            </h3>
            <p className="text-sm text-gray-500">
              {roomInfo?.job?.jobName || 'Job Position'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {hasMore && (
          <button
            onClick={loadMoreMessages}
            disabled={loading}
            className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load older messages'}
          </button>
        )}

        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderRole === 'Candidate' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderRole === 'Candidate'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
                {message.senderRole === 'Candidate' && (
                  <CheckCheck className={`h-3 w-3 ${message.isSeen ? 'text-blue-200' : 'text-gray-400'}`} />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Replies Section */}
      {showSmartReplies && smartReplies.length > 0 && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center mb-2">
            <Bot className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Smart Replies</span>
          </div>
          <div className="space-y-2">
            {smartReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => useSmartReply(reply)}
                className="block w-full text-left p-2 text-sm text-gray-800 bg-white border border-yellow-200 rounded hover:bg-yellow-50 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSmartReplies(false)}
            className="mt-2 text-xs text-yellow-600 hover:text-yellow-800"
          >
            Hide suggestions
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2 mb-2">
          {getLastRecruiterMessage() && (
            <button
              onClick={() => handleSmartReply(getLastRecruiterMessage())}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 disabled:opacity-50"
            >
              <Bot className="h-3 w-3" />
              <span>Smart Reply</span>
            </button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              const typing = e.target.value.length > 0;
              setIsTyping(typing);
              
              // Emit typing indicator
              if (typing) {
                socketService.emitTyping(roomId);
              } else {
                socketService.emitStopTyping(roomId);
              }
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsTyping(true)}
            onBlur={() => {
              setTimeout(() => setIsTyping(false), 1000); // Delay to allow for quick refocus
            }}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            rows="2"
            disabled={loading}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateChat;
