"use client";
import React, { useState } from 'react';

// Mock data for demonstration
const mockUser = {
  id: 'user123',
  name: 'Alex Taylor',
  avatar: '/api/placeholder/40/40'
};

const mockGroups = [
];

const mockGames = [
  {
    id: 1,
    title: "Autumn Reflections",
    groupName: "Poetry Circle",
    groupId: 1,
    status: "In Progress",
    currentPlayers: 5,
    maxPlayers: 6,
    lastActivity: "2025-03-16T14:30:00",
    isUserTurn: true
  },
  {
    id: 2,
    title: "Ocean Dreams",
    groupName: "Creative Writing Club",
    groupId: 2,
    status: "In Progress",
    currentPlayers: 8,
    maxPlayers: 8,
    lastActivity: "2025-03-15T09:15:00",
    isUserTurn: false
  },
  {
    id: 3,
    title: "City Lights",
    groupName: "Poetry Circle",
    groupId: 1,
    status: "In Progress",
    currentPlayers: 4,
    maxPlayers: 8,
    lastActivity: "2025-03-14T16:45:00",
    isUserTurn: true
  },
  {
    id: 4,
    title: "Mountain Whispers",
    groupName: "Haiku Masters",
    groupId: 3,
    status: "Waiting For Players",
    currentPlayers: 3,
    maxPlayers: 5,
    lastActivity: "2025-03-13T11:20:00",
    isUserTurn: false
  }
];

const mockPoems = [
  {
    id: 101,
    title: "Whispers of Spring",
    gameName: "Seasonal Verses",
    gameId: 5,
    groupId: 1,
    updatedAt: "2025-03-16T12:20:00",
    lastContributor: "Emily Chen",
    lines: 4,
    maxLines: 6
  },
  {
    id: 102,
    title: "Midnight Stars",
    gameName: "Cosmic Poetry",
    gameId: 4,
    groupId: 2,
    updatedAt: "2025-03-15T23:10:00",
    lastContributor: "James Wilson",
    lines: 5,
    maxLines: 5
  }
];

// Modal Components
const CreateGroupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Create New Group</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter group name..." />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

const JoinGroupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Join Group</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter invite code..." />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateGameModal = ({ isOpen, onClose, groups }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Create New Game</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Game Title</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter game title..." />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded" defaultValue={8} min={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lines per Poem</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded" defaultValue={6} min={3} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Navigation Component from previous demo
const QuickNavigation = () => {
  const [activeTab, setActiveTab] = useState('myTurn');

  const handleGameClick = (gameId) => {
    console.log(`Navigating to game ${gameId}`);
  };
  
  const handlePoemClick = (poemId, gameId) => {
    console.log(`Navigating to poem ${poemId} in game ${gameId}`);
  };
  
  const getActionGames = () => {
    return mockGames.filter(game => game.isUserTurn);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-3 flex items-center ${activeTab === 'myTurn' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('myTurn')}
        >
          <span>My Turn</span>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {getActionGames().length}
          </span>
        </button>
        <button
          className={`px-4 py-3 ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('active')}
        >
          <span>Active Games</span>
          <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{mockGames.length}</span>
        </button>
        <button
          className={`px-4 py-3 ${activeTab === 'recent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('recent')}
        >
          <span>Recent Updates</span>
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {/* My Turn Tab */}
        {activeTab === 'myTurn' && (
          <div className="space-y-4">
            {getActionGames().length > 0 ? (
              getActionGames().map(game => (
                <div 
                  key={game.id} 
                  className="border border-blue-200 bg-blue-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleGameClick(game.id)}
                >
                  <div>
                    <h4 className="font-semibold text-lg">{game.title}</h4>
                    <p className="text-sm text-gray-600">Group: {game.groupName}</p>
                    <p className="text-sm text-gray-600">
                      Waiting since {new Date(game.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Your Turn</span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                      Continue Poem
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No games waiting for your input!</p>
            )}
          </div>
        )}
        
        {/* Active Games Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {mockGames.map(game => (
              <div 
                key={game.id} 
                className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition ${game.isUserTurn ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleGameClick(game.id)}
              >
                <div>
                  <h4 className="font-semibold text-lg">{game.title}</h4>
                  <p className="text-sm text-gray-600">Group: {game.groupName}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">{game.status}</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                      {game.currentPlayers}/{game.maxPlayers} players
                    </span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  {game.isUserTurn && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Your Turn</span>
                  )}
                  <button 
                    className={`py-2 px-4 rounded text-sm ${game.isUserTurn ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                  >
                    {game.isUserTurn ? 'Continue Poem' : 'View Game'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Recent Updates Tab */}
        {activeTab === 'recent' && (
          <div className="space-y-4">
            {mockPoems.map(poem => (
              <div 
                key={poem.id} 
                className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => handlePoemClick(poem.id, poem.gameId)}
              >
                <div>
                  <h4 className="font-semibold text-lg">{poem.title || 'Untitled Poem'}</h4>
                  <p className="text-sm text-gray-600">Game: {poem.gameName}</p>
                  <p className="text-sm text-gray-600">Group: {mockGroups.find(g => g.id === poem.groupId)?.name}</p>
                  <div className="flex gap-2 mt-1">
                    <p className="text-sm text-gray-600">Progress: {poem.lines}/{poem.maxLines} lines</p>
                    <p className="text-sm text-gray-600">Last by: {poem.lastContributor}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <span className="text-xs text-gray-500 block text-right mb-1">
                    {new Date(poem.updatedAt).toLocaleString()}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View Poem
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeView, setActiveView] = useState('home');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">PoetryPlay</h1>
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700" onClick={() => setShowCreateGameModal(true)}>
              New Game
            </button>
            <div className="flex items-center gap-2">
              <img src={mockUser.avatar} alt="User avatar" className="w-8 h-8 rounded-full" />
              <span className="font-medium">{mockUser.name}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="font-bold text-lg mb-3">Navigation</h2>
              <nav className="space-y-1">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeView === 'home' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveView('home')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Home
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeView === 'groups' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveView('groups')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  My Groups
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeView === 'games' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveView('games')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                  </svg>
                  All Games
                </button>
              </nav>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold text-lg mb-3">My Groups</h2>
              <div className="space-y-2">
                {mockGroups.map(group => (
                  <div key={group.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.memberCount} members</p>
                    </div>
                    <span className="text-sm text-purple-600">{group.gameCount} games</span>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <button 
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded text-sm"
                    onClick={() => setShowJoinGroupModal(true)}
                  >
                    Join Group
                  </button>
                  <button 
                    className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 rounded text-sm"
                    onClick={() => setShowCreateGroupModal(true)}
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeView === 'home' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Welcome back, {mockUser.name}</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Games Needing Your Attention</h3>
                  <QuickNavigation />
                </div>
              </>
            )}
            
            {activeView === 'groups' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">My Groups</h2>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
                      onClick={() => setShowJoinGroupModal(true)}
                    >
                      Join Group
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      onClick={() => setShowCreateGroupModal(true)}
                    >
                      Create Group
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockGroups.map(group => (
                    <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{group.memberCount} members</span>
                          <span>{group.gameCount} games</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t flex justify-between">
                        <button className="text-gray-600 text-sm font-medium hover:text-gray-900">
                          View Members
                        </button>
                        <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
                          View Games
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {activeView === 'games' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">All Games</h2>
                  <button 
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    onClick={() => setShowCreateGameModal(true)}
                  >
                    Create Game
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Filters</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        My Turn
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        Waiting For Players
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        In Progress
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockGames.map(game => (
                    <div 
                      key={game.id} 
                      className={`bg-white border rounded-lg shadow-sm p-4 ${game.isUserTurn ? 'border-blue-300' : 'border-gray-200'}`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                          <p className="text-gray-600">Group: {game.groupName}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                              {game.status}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                              {game.currentPlayers}/{game.maxPlayers} players
                            </span>
                            <span className="px-2 py-0.5 text-gray-600 text-xs">
                              Last activity: {new Date(game.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center">
                          {game.isUserTurn && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                              Your Turn
                            </span>
                          )}
                          <button 
                            className={`py-2 px-4 rounded text-sm ${game.isUserTurn ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                          >
                            {game.isUserTurn ? 'Continue Poem' : 'View Game'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CreateGroupModal isOpen={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} />
      <JoinGroupModal isOpen={showJoinGroupModal} onClose={() => setShowJoinGroupModal(false)} />
      <CreateGameModal 
        isOpen={showCreateGameModal} 
        onClose={() => setShowCreateGameModal(false)} 
        groups={mockGroups}
      />
    </div>
  );
};

export default Dashboard;