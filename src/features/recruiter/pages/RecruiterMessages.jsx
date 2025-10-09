import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';

const RecruiterMessages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get real conversations from localStorage or API
  const conversations = [];

  // Get real messages from localStorage or API
  const messages = [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to backend
      setMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RecruiterLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 ${
                  selectedChat === index ? 'bg-teal-50 border-r-2 border-r-teal-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedChat(index)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                        {conversation.starred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{conversation.role}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate flex-1">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 bg-teal-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
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
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {filteredConversations[selectedChat]?.avatar}
                  </div>
                  {filteredConversations[selectedChat]?.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{filteredConversations[selectedChat]?.name}</h3>
                  <p className="text-sm text-gray-500">{filteredConversations[selectedChat]?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Phone className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Video className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Info className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'recruiter'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className={`flex items-center justify-between mt-1 ${
                    msg.sender === 'recruiter' ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{msg.time}</span>
                    {msg.sender === 'recruiter' && (
                      <div className="ml-2">
                        {msg.status === 'read' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCircle className="w-3 h-3 opacity-60" />
                        ) : (
                          <Clock className="w-3 h-3 opacity-60" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <motion.button
                className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12"
                />
                <motion.button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-teal-600 rounded transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Smile className="w-5 h-5" />
                </motion.button>
              </div>
              <motion.button
                onClick={handleSendMessage}
                className="p-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                disabled={!message.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterMessages;
