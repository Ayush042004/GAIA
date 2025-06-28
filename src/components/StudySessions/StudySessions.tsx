import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  MapPin,
  Video,
  BookOpen,
  Brain,
  X,
  UserPlus,
  Settings,
  Hash,
  Globe,
  Lock
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { StudySession, StudyRoom } from '../../types';
import { format, addDays, addHours } from 'date-fns';
import { generateStudyPlan, generateRoomCode } from '../../utils/aiSimulation';

export default function StudySessions() {
  const { state, dispatch } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'rooms'>('sessions');
  
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    startTime: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
    duration: 120,
    maxParticipants: 6,
    isPublic: true
  });

  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    maxParticipants: 8,
    isPublic: true,
    tags: ''
  });

  const mockSessions: StudySession[] = [
    {
      id: '1',
      title: 'Advanced Calculus Review',
      description: 'Deep dive into differential equations and applications',
      startTime: addHours(new Date(), 2),
      endTime: addHours(new Date(), 4),
      participants: [
        { id: '1', name: 'Alex Chen', email: 'alex@example.com' },
        { id: '2', name: 'Sarah Kim', email: 'sarah@example.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com' }
      ],
      materials: state.studyMaterials.slice(0, 2),
      status: 'scheduled',
      createdBy: 'demo-user',
      maxParticipants: 6,
      isPublic: true,
      joinCode: 'CALC24'
    },
    {
      id: '2',
      title: 'Chemistry Lab Prep',
      description: 'Preparing for organic chemistry laboratory session',
      startTime: addDays(new Date(), 1),
      endTime: addHours(addDays(new Date(), 1), 3),
      participants: [
        { id: '1', name: 'Alex Chen', email: 'alex@example.com' },
        { id: '4', name: 'Emma Wilson', email: 'emma@example.com' }
      ],
      materials: [],
      status: 'scheduled',
      createdBy: 'demo-user',
      maxParticipants: 4,
      isPublic: true,
      joinCode: 'CHEM24'
    }
  ];

  const allSessions = [...state.studySessions, ...mockSessions];

  const handleCreateSession = () => {
    const studyPlan = generateStudyPlan(state.studyMaterials);
    
    const session: StudySession = {
      id: uuidv4(),
      title: newSession.title || studyPlan.title,
      description: newSession.description || studyPlan.description,
      startTime: new Date(newSession.startTime),
      endTime: new Date(new Date(newSession.startTime).getTime() + newSession.duration * 60000),
      participants: [state.user!],
      materials: state.studyMaterials,
      status: 'scheduled',
      createdBy: state.user?.id || 'demo-user',
      maxParticipants: newSession.maxParticipants,
      isPublic: newSession.isPublic,
      joinCode: generateRoomCode()
    };

    dispatch({ type: 'ADD_STUDY_SESSION', payload: session });
    setShowCreateModal(false);
    resetNewSession();
  };

  const handleCreateRoom = () => {
    const room: StudyRoom = {
      id: uuidv4(),
      name: newRoom.name,
      description: newRoom.description,
      participants: [state.user!],
      maxParticipants: newRoom.maxParticipants,
      isActive: true,
      createdAt: new Date(),
      whiteboardElements: [],
      isPublic: newRoom.isPublic,
      joinCode: generateRoomCode(),
      createdBy: state.user?.id || 'demo-user',
      tags: newRoom.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    dispatch({ type: 'ADD_STUDY_ROOM', payload: room });
    setShowRoomModal(false);
    resetNewRoom();
  };

  const handleJoinSession = (sessionId: string) => {
    if (state.user) {
      dispatch({ 
        type: 'JOIN_STUDY_SESSION', 
        payload: { sessionId, user: state.user } 
      });
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (state.user) {
      dispatch({ 
        type: 'JOIN_STUDY_ROOM', 
        payload: { roomId, user: state.user } 
      });
      
      // Set as current room and switch to whiteboard
      const room = state.studyRooms.find(r => r.id === roomId);
      if (room) {
        dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'whiteboard' });
      }
    }
  };

  const handleJoinByCode = () => {
    const room = state.studyRooms.find(r => r.joinCode === joinCode.toUpperCase());
    const session = allSessions.find(s => s.joinCode === joinCode.toUpperCase());
    
    if (room) {
      handleJoinRoom(room.id);
      setShowJoinModal(false);
      setJoinCode('');
    } else if (session) {
      handleJoinSession(session.id);
      setShowJoinModal(false);
      setJoinCode('');
    } else {
      alert('Invalid join code. Please check and try again.');
    }
  };

  const resetNewSession = () => {
    setNewSession({
      title: '',
      description: '',
      startTime: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
      duration: 120,
      maxParticipants: 6,
      isPublic: true
    });
  };

  const resetNewRoom = () => {
    setNewRoom({
      name: '',
      description: '',
      maxParticipants: 8,
      isPublic: true,
      tags: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Hub</h1>
          <p className="text-gray-600">Schedule sessions and join study rooms</p>
        </motion.div>

        <div className="flex items-center space-x-3">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
          >
            <Hash className="w-4 h-4" />
            <span>Join by Code</span>
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span>Create Session</span>
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoomModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span>Create Room</span>
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-purple-100 w-fit">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'sessions'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Study Sessions
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'rooms'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Study Rooms
        </button>
      </div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'sessions' ? (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {allSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{session.title}</h3>
                      {session.isPublic ? (
                        <Globe className="w-4 h-4 text-green-500" title="Public session" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" title="Private session" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{session.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'scheduled' 
                      ? 'bg-blue-100 text-blue-800'
                      : session.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{format(session.startTime, 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>
                      {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>{session.participants.length}/{session.maxParticipants || 'unlimited'} participants</span>
                  </div>

                  {session.materials.length > 0 && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      <span>{session.materials.length} study material{session.materials.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {session.joinCode && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Hash className="w-4 h-4 text-purple-500" />
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{session.joinCode}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinSession(session.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-md transition-shadow"
                  >
                    <Video className="w-4 h-4 inline mr-2" />
                    Join Session
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors"
                  >
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="rooms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {state.studyRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      {room.isPublic ? (
                        <Globe className="w-4 h-4 text-green-500" title="Public room" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" title="Private room" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{room.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">{room.participants.length}/{room.maxParticipants}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Join Code</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{room.joinCode}</span>
                  </div>
                </div>

                {room.tags && room.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJoinRoom(room.id)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium text-sm hover:shadow-md transition-shadow"
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Join Room
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Study Plan Suggestion */}
      {state.studyMaterials.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Study Plan Suggestion</h3>
              <p className="text-gray-600 mb-4">
                Based on your {state.studyMaterials.length} uploaded materials, I recommend creating focused study sessions with AI-generated insights and collaborative problem-solving.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-md transition-shadow"
              >
                Create AI-Suggested Session
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Session Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create Study Session</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Advanced Calculus Review"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newSession.description}
                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the study session"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={newSession.maxParticipants}
                    onChange={(e) => setNewSession({ ...newSession, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newSession.isPublic}
                    onChange={(e) => setNewSession({ ...newSession, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this session public
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateSession}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
                >
                  Create Session
                </motion.button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showRoomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRoomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create Study Room</h2>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Advanced Mathematics"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the study room"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={newRoom.maxParticipants}
                    onChange={(e) => setNewRoom({ ...newRoom, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newRoom.tags}
                    onChange={(e) => setNewRoom({ ...newRoom, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., mathematics, calculus, algebra"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="roomIsPublic"
                    checked={newRoom.isPublic}
                    onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="roomIsPublic" className="text-sm text-gray-700">
                    Make this room public
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateRoom}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
                >
                  Create Room
                </motion.button>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join by Code Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Join by Code</h2>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Join Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-center text-lg tracking-wider"
                    placeholder="ABCD12"
                    maxLength={6}
                  />
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Enter the 6-character code to join a session or room
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinByCode}
                  disabled={joinCode.length !== 6}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </motion.button>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}