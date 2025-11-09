import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Search, User, Building2, Clock, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import CandidateChat from '../components/CandidateChat.jsx';
import ApiService from '../../../services/apiService';

const CandidateMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(searchParams.get('roomId') || localStorage.getItem('candidateSelectedRoomId') || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to update selected chat with persistence
  const updateSelectedChat = (roomId) => {
    setSelectedRoomId(roomId);
    
    // Update URL params and localStorage
    if (roomId) {
      setSearchParams({ roomId });
      localStorage.setItem('candidateSelectedRoomId', roomId);
    } else {
      setSearchParams({});
      localStorage.removeItem('candidateSelectedRoomId');
    }
  };

  // Fetch candidate's chat rooms
  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      
      // Get candidate's actual chat rooms from the backend
      const chatRoomsResponse = await ApiService.getCandidateChatRooms();
      
      // Process existing chat rooms
      const existingChatRooms = (chatRoomsResponse.rooms || []).map(room => ({
        id: room._id,
        applicationId: room.candidate?._id,
        recruiterName: room.recruiter?.fullName || 'Recruiter',
        companyName: room.job?.company || 'Company',
        jobTitle: room.job?.jobName || 'Job Position',
        lastMessage: room.lastMessage || 'No messages yet',
        lastMessageTime: room.lastMessageAt ? new Date(room.lastMessageAt) : new Date(room.createdAt),
        unreadCount: 0, // TODO: Calculate actual unread count
        isActive: selectedRoomId === room._id,
        roomData: room
      }));

      setChatRooms(existingChatRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  // Sync URL parameters with state
  useEffect(() => {
    const roomId = searchParams.get('roomId');
    if (roomId) {
      setSelectedRoomId(roomId);
      localStorage.setItem('candidateSelectedRoomId', roomId);
    }
  }, [searchParams]);

  // Update active states when selectedRoomId changes
  useEffect(() => {
    if (chatRooms.length > 0) {
      setChatRooms(prev => prev.map(room => ({
        ...room,
        isActive: room.id === selectedRoomId
      })));
    }
  }, [selectedRoomId]);

  const filteredChats = chatRooms.filter(chat => 
    chat.recruiterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatSelect = async (chatRoom) => {
    try {
      updateSelectedChat(chatRoom.id);
      
      // Clear unread count for selected chat
      setChatRooms(prev => prev.map(room => ({
        ...room,
        unreadCount: room.id === chatRoom.id ? 0 : room.unreadCount
      })));
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-400">
                  Conversations will appear here when recruiters contact you about your applications
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedRoomId === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {chat.recruiterName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 mt-1">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500 truncate">
                            {chat.companyName}
                          </p>
                        </div>
                        
                        <p className="text-sm text-blue-600 font-medium truncate mt-1">
                          {chat.jobTitle}
                        </p>
                        
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                        
                        {chat.unreadCount > 0 && (
                          <div className="flex items-center justify-between mt-2">
                            <span></span>
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {chat.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedRoomId ? (
            <CandidateChat
              roomId={selectedRoomId}
              onClose={() => {
                updateSelectedChat(null);
                // Refresh chat list to remove closed chats
                fetchChatRooms();
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to Messages
                </h3>
                <p className="text-gray-500 mb-4">
                  Select a conversation to start chatting with recruiters
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Recruiters can start conversations with you based on your job applications. 
                    Make sure your profile is complete to attract more opportunities!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateMessages;
