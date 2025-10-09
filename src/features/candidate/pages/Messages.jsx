import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  User,
  Building2,
  Circle,
  Check,
  CheckCheck
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Get real chats from localStorage or API
  const chats = [];

  const currentChat = chats.find(chat => chat.id === selectedChat);
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, currentChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      content: message,
      timestamp: new Date(),
      type: 'sent',
      status: 'sent'
    };

    // Update the current chat's messages
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message,
          timestamp: 'now'
        };
      }
      return chat;
    });

    setMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="flex h-full">
          {/* Chat List */}
          <div className="w-full md:w-80 border-r border-white/20 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-white/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 ${
                    selectedChat === chat.id ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-white/60">{chat.timestamp}</span>
                      </div>
                      
                      <p className="text-sm text-white/70 mb-1">{chat.role} • {chat.company}</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/60 truncate flex-1">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <div className="ml-2 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      {currentChat.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{currentChat.name}</h3>
                      <p className="text-sm text-white/70">{currentChat.role} • {currentChat.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Phone className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Video className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {currentChat.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className={`max-w-xs lg:max-w-md ${msg.type === 'sent' ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              msg.type === 'sent'
                                ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white'
                                : 'bg-white text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div className={`flex items-center mt-1 space-x-1 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-white/60">{formatTime(msg.timestamp)}</span>
                            {msg.type === 'sent' && getMessageStatus(msg.status)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Paperclip className="w-5 h-5" />
                    </motion.button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                      <motion.button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Smile className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <motion.button
                      onClick={handleSendMessage}
                      className="p-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      disabled={!message.trim()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No conversation selected</h3>
                  <p className="text-white/60">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
