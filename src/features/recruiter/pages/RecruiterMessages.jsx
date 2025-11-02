import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MessageCircle, Search, User, Building2, Clock, Plus, Users } from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import RecruiterChat from '../components/RecruiterChat.jsx';
import ApiService from '../../../services/apiService';

const RecruiterMessages = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(searchParams.get('roomId') || localStorage.getItem('selectedRoomId') || null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(searchParams.get('applicationId') || localStorage.getItem('selectedApplicationId') || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Helper function to update selected chat with persistence
  const updateSelectedChat = (roomId, applicationId) => {
    setSelectedRoomId(roomId);
    setSelectedApplicationId(applicationId);
    
    // Update URL params
    if (roomId && applicationId) {
      setSearchParams({ roomId, applicationId });
      // Store in localStorage for persistence
      localStorage.setItem('selectedRoomId', roomId);
      localStorage.setItem('selectedApplicationId', applicationId);
    } else {
      setSearchParams({});
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('selectedApplicationId');
    }
  };

  // Fetch existing chat rooms and applications
  const fetchChatData = async () => {
    try {
      setLoading(true);
      
      // Fetch both chat rooms and applications in parallel
      const [chatRoomsResponse, applicationsResponse] = await Promise.all([
        ApiService.getChatRooms(),
        ApiService.getRecruiterApplications()
      ]);
      
      // Filter applications that are suitable for chat (not rejected)
      const chatableApplications = applicationsResponse.applications?.filter(
        app => app.status !== 'Rejected' && app.status !== 'Withdrawn'
      ) || [];
      
      setApplications(chatableApplications);
      
      // Process existing chat rooms
      const existingChatRooms = (chatRoomsResponse.chatRooms || []).map(room => ({
        id: room._id,
        applicationId: room.candidate?._id,
        candidateName: room.candidate?.fullName || 'Candidate',
        candidateEmail: room.candidate?.email || '',
        jobTitle: room.job?.jobName || 'Job Position',
        lastMessage: room.lastMessage?.text || 'No messages yet',
        lastMessageTime: room.lastMessage?.createdAt ? new Date(room.lastMessage.createdAt) : new Date(room.createdAt),
        unreadCount: 0, // TODO: Calculate actual unread count
        isActive: selectedRoomId === room._id,
        roomData: room
      }));

      setChatRooms(existingChatRooms);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  // Update active states when selectedRoomId changes
  useEffect(() => {
    if (chatRooms.length > 0) {
      setChatRooms(prev => prev.map(room => ({
        ...room,
        isActive: room.id === selectedRoomId
      })));
    }
  }, [selectedRoomId]);

  // Sync URL parameters with state
  useEffect(() => {
    const roomId = searchParams.get('roomId');
    const applicationId = searchParams.get('applicationId');
    
    if (roomId && applicationId) {
      setSelectedRoomId(roomId);
      setSelectedApplicationId(applicationId);
      localStorage.setItem('selectedRoomId', roomId);
      localStorage.setItem('selectedApplicationId', applicationId);
    }
  }, [searchParams]);

  // Validate selected room exists in chat rooms
  useEffect(() => {
    if (selectedRoomId && chatRooms.length > 0) {
      const roomExists = chatRooms.find(room => room.id === selectedRoomId);
      if (!roomExists) {
        // Room doesn't exist, clear selection
        updateSelectedChat(null, null);
      }
    }
  }, [selectedRoomId, chatRooms]);

  const filteredChats = chatRooms.filter(chat => 
    chat.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartNewChat = async (application) => {
    try {
      setLoading(true);
      
      // Debug: Check application structure
      console.log('Application object:', application);
      
      // Get IDs - handle both nested objects and direct IDs
      const jobId = application.job?._id || application.job?.id || application.job;
      const candidateId = application.candidate?._id || application.candidate?.id || application.candidate;
      
      console.log('JobId:', jobId, 'CandidateId:', candidateId);
      
      if (!jobId || !candidateId) {
        alert('Missing job or candidate information. Please try again.');
        return;
      }
      
      // Initiate chat room with candidate
      const response = await ApiService.initiateChatRoom(jobId, candidateId);
      
      if (response.room) {
        const newChatRoom = {
          id: response.room._id,
          applicationId: application._id,
          candidateName: application.candidate?.fullName || 'Candidate',
          candidateEmail: application.candidate?.email || '',
          jobTitle: application.job?.jobName || 'Job Position',
          lastMessage: 'Chat started',
          lastMessageTime: new Date(),
          unreadCount: 0,
          isActive: true,
          application: application
        };
        
        // Add to chat rooms if not already exists
        setChatRooms(prev => {
          const exists = prev.find(room => room.id === newChatRoom.id);
          if (exists) {
            return prev.map(room => ({
              ...room,
              isActive: room.id === newChatRoom.id
            }));
          }
          return [newChatRoom, ...prev];
        });
        
        updateSelectedChat(response.room._id, application._id);
        setShowNewChatModal(false);
        
        // Refresh chat list to get the latest data
        fetchChatData();
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chatRoom) => {
    updateSelectedChat(chatRoom.id, chatRoom.applicationId);
    
    // Clear unread count for selected chat
    setChatRooms(prev => prev.map(room => ({
      ...room,
      unreadCount: room.id === chatRoom.id ? 0 : room.unreadCount
    })));
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

  const availableApplications = applications.filter(app => 
    !chatRooms.some(room => room.applicationId === app._id)
  );

  return (
    <RecruiterLayout>
      <div className="h-full flex bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">No conversations yet</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Start New Chat</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedRoomId === chat.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {chat.candidateName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.candidateEmail}
                        </p>
                        
                        <p className="text-sm text-green-600 font-medium truncate mt-1">
                          {chat.jobTitle}
                        </p>
                        
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                        
                        {chat.unreadCount > 0 && (
                          <div className="flex items-center justify-between mt-2">
                            <span></span>
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
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
            <RecruiterChat
              roomId={selectedRoomId}
              applicationId={selectedApplicationId}
              onClose={() => {
                updateSelectedChat(null, null);
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
                  Select a conversation or start a new chat with candidates
                </p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Start New Chat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">Select a candidate from your applications to start chatting</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {availableApplications.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No available candidates to chat with</p>
                  <p className="text-sm text-gray-400 mt-2">
                    All eligible candidates already have active conversations
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {availableApplications.map((application) => (
                    <div
                      key={application._id}
                      onClick={() => handleStartNewChat(application)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {application.candidate?.fullName || 'Candidate'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.candidate?.email}
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Applied for: {application.job?.jobName}
                          </p>
                          <p className="text-xs text-gray-400">
                            Status: {application.status} • Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
};

export default RecruiterMessages;
